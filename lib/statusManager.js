'use strict';

/**
 * lib/statusManager.js
 * Status@broadcast handler for gifted-baileys
 */

const config = require('../config');

const _seenIds = new Set();

function unwrapStatus(m) {
    let inner = { ...(m.message || {}) };
    if (inner.ephemeralMessage)  inner = { ...(inner.ephemeralMessage.message  || inner) };
    if (inner.viewOnceMessageV2) inner = { ...(inner.viewOnceMessageV2.message || inner) };
    if (inner.viewOnceMessage)   inner = { ...(inner.viewOnceMessage.message   || inner) };

    const ORDER = [
        'imageMessage', 'videoMessage', 'audioMessage',
        'extendedTextMessage', 'conversation', 'stickerMessage',
        'documentMessage', 'reactionMessage',
    ];
    const msgType = ORDER.find(k => inner[k]) || Object.keys(inner)[0] || 'unknown';
    return { inner, msgType };
}

function resolvePhoneJid(key) {
    if (key.participantPn && key.participantPn.includes('@s.whatsapp.net')) {
        return key.participantPn;
    }
    if (key.participant && key.participant.includes('@s.whatsapp.net')) {
        return key.participant;
    }
    if (key.participant && key.participant.includes('@lid') && global.lidJidMap?.has(key.participant)) {
        return global.lidJidMap.get(key.participant);
    }
    return key.participant || null;
}

async function handleStatusBroadcast(sock, m, saveMedia) {
    try {
        const statusId    = m.key.id;
        const participant = m.key.participant;

        if (!participant) return;

        if (_seenIds.has(statusId)) {
            console.log(`[StatusMgr] ⏭️  Duplicate status skipped: ${statusId}`);
            return;
        }
        _seenIds.add(statusId);
        if (_seenIds.size > 500) {
            const oldest = _seenIds.values().next().value;
            _seenIds.delete(oldest);
        }

        const { inner, msgType } = unwrapStatus(m);

        const phoneJid = resolvePhoneJid(m.key);
        const botRaw   = sock.user?.id || global.botJid || '';
        const botPhone = botRaw.replace(/:\d+@/, '@');

        console.log(`[StatusMgr] >>> id=${statusId} lid=${participant} phoneJid=${phoneJid} type=${msgType}`);
        console.log(`[StatusMgr] ⚙️  view=${config.AUTO_STATUS_SEEN} react=${config.AUTO_STATUS_REACT} reply=${config.AUTO_STATUS_REPLY}`);

        // ── 1. Auto View ───────────────────────────────────────────────────────
        if (config.AUTO_STATUS_SEEN) {
            let viewDone = false;

            try {
                await sock.sendReceipt('status@broadcast', participant, [statusId], 'read');
                console.log('[StatusMgr] ✅ VIEW OK via sendReceipt');
                viewDone = true;
            } catch (e1) {
                console.warn(`[StatusMgr] sendReceipt failed: ${e1.message}`);
            }

            if (!viewDone) {
                try {
                    await sock.readMessages([{
                        remoteJid:   'status@broadcast',
                        id:          statusId,
                        participant: participant,
                        fromMe:      false,
                    }]);
                    console.log('[StatusMgr] ✅ VIEW OK via readMessages');
                    viewDone = true;
                } catch (e2) {
                    console.warn(`[StatusMgr] readMessages failed: ${e2.message}`);
                }
            }

            if (!viewDone) console.error('[StatusMgr] ❌ VIEW FAILED — all methods exhausted');
        }

        // ── 2. Auto React ──────────────────────────────────────────────────────
        if (config.AUTO_STATUS_REACT) {
            const emojis      = (config.CUSTOM_REACT_EMOJIS || '❤️,🔥,💯,😍,👏').split(',');
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)].trim() || '❤️';

            const statusJidList = [phoneJid, botPhone].filter(Boolean);

            console.log(`[StatusMgr] 🔄 REACT emoji=${randomEmoji} statusJidList=${JSON.stringify(statusJidList)}`);

            try {
                await sock.sendMessage(
                    'status@broadcast',
                    {
                        react: {
                            text: randomEmoji,
                            key:  m.key,
                        },
                    },
                    { statusJidList }
                );
                console.log('[StatusMgr] ✅ REACT sent OK');
            } catch (e) {
                console.error(`[StatusMgr] ❌ REACT FAILED: ${e.message}`);
            }
        }

        // ── 3. Auto Reply ──────────────────────────────────────────────────────
        if (config.AUTO_STATUS_REPLY && !m.key.fromMe) {
            const replyTo = phoneJid || participant;
            try {
                await sock.sendMessage(
                    replyTo,
                    {
                        text: config.AUTO_STATUS_MSG || 'Seen by MALIK MD 💖',
                        contextInfo: {
                            stanzaId:      statusId,
                            participant:   replyTo,
                            quotedMessage: inner,
                        },
                    }
                );
                console.log('[StatusMgr] ✅ REPLY sent OK');
            } catch (e) {
                console.warn(`[StatusMgr] ⚠️ REPLY failed: ${e.message}`);
            }
        }

        // ── 4. Status Saver ────────────────────────────────────────────────────
        if (config.Status_Saver === 'true' && typeof saveMedia === 'function') {
            try {
                const displayJid   = phoneJid || participant;
                const userName     = await sock.getName?.(displayJid) || displayJid.split('@')[0];
                const header       = 'AUTO STATUS SAVER';
                let   caption      = `${header}\n\n*🩵 Status From:* ${userName}`;

                switch (msgType) {
                    case 'imageMessage':
                    case 'videoMessage':
                        if (inner[msgType]?.caption) caption += `\n*🩵 Caption:* ${inner[msgType].caption}`;
                        await saveMedia({ message: inner }, msgType, sock, caption);
                        break;
                    case 'audioMessage':
                        caption += '\n*🩵 Audio Status*';
                        await saveMedia({ message: inner }, msgType, sock, caption);
                        break;
                    case 'extendedTextMessage':
                        caption = `${header}\n\n${inner.extendedTextMessage?.text || ''}`;
                        await sock.sendMessage(sock.user.id, { text: caption });
                        break;
                    default:
                        console.warn(`[StatusMgr] ℹ️ No saver handler for type: ${msgType}`);
                        break;
                }

                if (config.STATUS_REPLY === 'true') {
                    const replyMsg = config.STATUS_MSG || 'MALIK MD 💖 SUCCESSFULLY VIEWED YOUR STATUS';
                    await sock.sendMessage(phoneJid || participant, { text: replyMsg });
                }

                console.log(`[StatusMgr] ✅ Status saved: ${statusId}`);
            } catch (e) {
                console.error(`[StatusMgr] ❌ Save failed: ${e.message}`);
            }
        }

    } catch (e) {
        console.error(`[StatusMgr] ❌ Handler error: ${e.message}\n${e.stack}`);
    }
}

function getAutoStatusSettings() {
    const flags = global.autoStatusFlags || {};
    const resolve = (runtimeVal, configVal) => {
        if (runtimeVal !== null && runtimeVal !== undefined) return String(runtimeVal);
        if (configVal  !== null && configVal  !== undefined) return String(configVal);
        return 'false';
    };
    return {
        autoviewStatus:   resolve(flags.seen,  config.AUTO_STATUS_SEEN),
        autoLikeStatus:   resolve(flags.react, config.AUTO_STATUS_REACT),
        autoReplyStatus:  resolve(null,        config.AUTO_STATUS_REPLY),
        statusReplyText:  config.AUTO_STATUS_MSG      || 'Seen by MALIK MD 💖',
        statusLikeEmojis: config.CUSTOM_REACT_EMOJIS  || '❤️,🔥,💯,😍,👏',
        statusSaver:      String(config.Status_Saver  || 'false'),
        statusSaverReply: String(config.STATUS_REPLY  || 'false'),
        statusSaverMsg:   config.STATUS_MSG           || 'MALIK MD 💖 SUCCESSFULLY VIEWED YOUR STATUS',
    };
}

module.exports = { handleStatusBroadcast, getAutoStatusSettings, unwrapStatus };
