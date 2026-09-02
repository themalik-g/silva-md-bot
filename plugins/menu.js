'use strict';

const fs      = require('fs');
const path    = require('path');
const config  = require('../config');
const { getStr } = require('../lib/theme');
const moment  = require('moment-timezone');

const TZ = 'Africa/Nairobi';

// ── Category definitions ──────────────────────────────────────────────────────
const CATEGORIES = [
    { id: 1,  icon: '⬇️',  name: 'Downloaders',        cmds: ['yt','ytmp3','ytmp4','tiktok','instagram','facebook','spotify','soundcloud','capcut','apk','catbox','tourl','pinterest','reddit','twitter','threads','gdrive'] },
    { id: 2,  icon: '🎵',  name: 'Music & Audio',       cmds: ['play','shazam','lyrics','toaudio','bgm','addbgm','setbgm','clearbgm','transcribe','tts'] },
    { id: 3,  icon: '🤖',  name: 'AI & Intelligence',   cmds: ['ai','gpt4','gpt4o','gemini','bard','venice','openai','letmegpt','ask','silva','malik','assistant','imagine','translate','define','calc','shorten','gitclone','anime','manga','describe','caption','carbon'] },
    { id: 4,  icon: '🔍',  name: 'Search & Info',       cmds: ['wiki','country','ip','currency','time','weather','numberfact','stalk','whois','dns','speedtest','ipinfo','screenshot','fetch','githubstalk'] },
    { id: 5,  icon: '🖼️', name: 'Media & Stickers',    cmds: ['sticker','stickersearch','togif','tojpeg','emojimix','textsticker','qrcode','react','ocr','ascii','color','getpp','togstatus','statussave','captionimage','quotly','viewonce'] },
    { id: 6,  icon: '👥',  name: 'Group Management',    cmds: ['kick','promote','demote','ban','unban','banlist','tagall','hidetag','poll','multipoll','pollresult','lock','unlock','link','revoke','setname','setdesc','broadcast','purge','dmall','warn','mute','unmute','pin','unpin','edit','groupinfo','grouprules','groupstatus','setbio'] },
    { id: 7,  icon: '👋',  name: 'Welcome & Events',    cmds: ['welcome','goodbye','setwelcome','setgoodbye','welcomequiz','setquiz'] },
    { id: 8,  icon: '🛡️', name: 'Protection',          cmds: ['antidemote','antidelete','antilink','anticall','antivv','antiscam','antibadwords','antibot','antifake','antiflood','antigm','antispam','afk','auditlog','blocklist','block','unblock','warn','warnlist','clearwarn'] },
    { id: 9,  icon: '😄',  name: 'Fun & Entertainment', cmds: ['joke','fact','riddle','meme','quote','advice','compliment','flip','bible','pickup','roast','truth','dare','ship','pair','marry','divorce','slots','8ball'] },
    { id: 10, icon: '🔧',  name: 'Text & Dev Tools',    cmds: ['reverse','upper','lower','mock','binary','rot13','json','timestamp','regex','httpcode','password','hash','encode','decode','wordcount','urlencode','urldecode','morse','base64','carbon','cron','chmod','ascii'] },
    { id: 11, icon: '📊',  name: 'Leveling & Analytics',cmds: ['level','rank','xp','leaderboard','analytics','topusers','peakhours','presence'] },
    { id: 12, icon: '📰',  name: 'Channels',            cmds: ['newsletter','followchannel','unfollowchannel','channelinfo'] },
    { id: 13, icon: '🎮',  name: 'Games',               cmds: ['rps','hangman','ttt','trivia','slots','8ball','scramble','flagquiz','mathquiz','wordchain','emojiguess','numberguess','wordgame','capitalquiz','tictactoe','typerace','dailychallenge','challenge'] },
    { id: 14, icon: '💰',  name: 'Finance & Crypto',    cmds: ['crypto','loan','savings','tax','split','salary','discount','currency','budget','expense','balances','networth','inflation','invest','bitcoin'] },
    { id: 15, icon: '📚',  name: 'Education',           cmds: ['element','planet','zodiac','vocab','acronym','flag','nato','phrasebook','define','bible'] },
    { id: 16, icon: '📝',  name: 'Productivity',        cmds: ['remind','rremind','myreminders','bookmark','save','saved','notes','addnote','todo','autoreply','awaymsg','schedule','timer','expense'] },
    { id: 17, icon: '💪',  name: 'Health & Fitness',    cmds: ['workout','stretching','calories','water','sleep','meditation','steps','yoga','bmi'] },
    { id: 18, icon: '🤝',  name: 'Lend & Sub-bot',      cmds: ['lend','approvelend','rejectlend','revokelend','lendlist','lendstatus','subbot','subbots','mybotinfo','getcode','paircode','getpair','sessioncode','connectbot'] },
    { id: 19, icon: '🕵️', name: 'Stalk & Lookup',      cmds: ['stalk','devicecheck','whois','githubstalk','tiktokstalk','checkscam','virus','tempmail','dns','ipinfo'] },
    { id: 20, icon: 'ℹ️', name: 'Bot Info',            cmds: ['alive','ping','uptime','owner','getjid','repo','menu','help','support','call','botinfo'] },
    { id: 21, icon: '👑',  name: 'Owner & Sudo',        cmds: ['sudo','setsudo','delsudo','getsudo','resetsudo','block','unblock','setmode','setprefix','setbotname','join','cmd','restart','shutdown','backupgroup','restoregroup','broadcast','eval','dmall','autojoin','cleanup','lendlimit'] },
];

function hline(n = 38) { return '─'.repeat(n); }

function box(title, lines) {
    return `╭─「 ${title} 」\n${lines.map(l => `│  ${l}`).join('\n')}\n╰${hline()}`;
}

function loadPlugins() {
    const dir = path.join(__dirname);
    const out = [];
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
        try {
            const p = require(path.join(dir, f));
            if (Array.isArray(p.commands) && p.commands.length) out.push(p);
        } catch { }
    }
    return out;
}

// ── Single Full Menu ─────────────────────────────────────────────────────────
function buildFullMenu(plugins, pfx, botName, mode) {
    const allCmds   = new Set(plugins.flatMap(p => p.commands || []));
    const modeEmoji = mode === 'PUBLIC' ? '🟢' : mode === 'PRIVATE' ? '🔒' : '🔵';
    const now       = moment().tz(TZ);
    const ownerName = config.OWNER_NAME || 'MALIK MEHTAB';

    const header =
        `╔══════════════════════════════════╗\n` +
        `║  ⚡  *${botName.toUpperCase().slice(0,26).padEnd(26)}*  ⚡  ║\n` +
        `║   _The Ultimate WhatsApp Bot_    ║\n` +
        `╚══════════════════════════════════╝\n`;

    const statusBlock = box(`📋 Bot Status`, [
        `◆ *Owner:*    ${ownerName}`,
        `◆ *Prefix:*   \`${pfx}\``,
        `◆ *Mode:*     ${modeEmoji} ${mode}`,
        `◆ *Commands:* ${allCmds.size}`,
        `◆ *Date:*     ${now.format('ddd D MMM YYYY')}`,
        `◆ *Time:*     ${now.format('hh:mm A')}`,
    ]);

    const catBlocks = [];
    const categorisedCmds = new Set();

    for (const cat of CATEGORIES) {
        const found = [...new Set(cat.cmds.filter(c => allCmds.has(c)))];
        if (!found.length) continue;
        found.forEach(c => categorisedCmds.add(c));

        const cmdList = found.map(c => `\`${pfx}${c}\``).join(' • ');
        catBlocks.push(
            `╭──「 ${cat.icon} *${cat.name.toUpperCase()}* 」\n` +
            `│  ${cmdList}\n` +
            `╰${hline()}`
        );
    }

    // Include any active commands from plugins not in CATEGORIES list
    const remaining = [...allCmds].filter(c => !categorisedCmds.has(c));
    if (remaining.length) {
        const cmdList = remaining.map(c => `\`${pfx}${c}\``).join(' • ');
        catBlocks.push(
            `╭──「 📌 *OTHER COMMANDS* 」\n` +
            `│  ${cmdList}\n` +
            `╰${hline()}`
        );
    }

    const footer =
        `\n> ⚡ _Powered by ${botName} | Dev: MALIK MEHTAB_`;

    return `${header}\n${statusBlock}\n\n${catBlocks.join('\n\n')}\n${footer}`;
}

function buildCommandHelp(cmdName, plugins, pfx) {
    const plugin = plugins.find(p => (p.commands || []).includes(cmdName));
    if (!plugin) {
        return `❌ Command \`${pfx}${cmdName}\` not found.\n\nUse \`${pfx}menu\` to browse all commands.`;
    }
    const aliases = (plugin.commands || []).filter(c => c !== cmdName);
    const perm    = (plugin.permission || 'public').toLowerCase();
    const permTag = perm === 'owner' ? '👑 Owner only' : perm === 'admin' ? '⚙️ Admin only' : '🌍 Public';

    return [
        ``,
        `📖 *Command Help*`,
        ``,
        box(`${pfx}${cmdName}`, [
            `◆ *Description:*`,
            `   ${plugin.description || 'No description available.'}`,
            ``,
            `◆ *Usage:*`,
            `   ${plugin.usage ? plugin.usage.replace(/\./g, pfx) : `\`${pfx}${cmdName}\``}`,
            ``,
            `◆ *Permission:*  ${permTag}`,
            `◆ *Group:*       ${plugin.group ? '✅ Yes' : '❌ No'}`,
            `◆ *Private:*     ${plugin.private !== false ? '✅ Yes' : '❌ No'}`,
            ...(aliases.length ? [`◆ *Aliases:*     ${aliases.map(a => `\`${pfx}${a}\``).join(' • ')}`] : []),
        ]),
        ``,
        `> _Use \`${pfx}menu\` to browse all commands_`
    ].join('\n');
}

module.exports = {
    commands:    ['menu', 'help', 'list', 'cmds', 'commands'],
    description: 'Show all commands in a clean single menu',
    usage:       '.menu | .help <command>',
    permission:  'public',
    group:       true,
    private:     true,

    run: async (sock, message, args, ctx) => {
        const { prefix, contextInfo, safeSend } = ctx;
        const plugins = loadPlugins();
        const botName = getStr('botName') || config.BOT_NAME || 'MALIK MD';
        const mode    = (config.MODE || 'public').toUpperCase();
        const pfx     = prefix || '.';
        const imgUrl  = getStr('pic1') || config.ALIVE_IMG || 'https://files.catbox.moe/5uli5p.jpeg';

        const rawCmd = (
            message.message?.extendedTextMessage?.text ||
            message.message?.conversation || ''
        ).trim().split(/\s+/)[0].replace(/^[^\w]/, '').toLowerCase();

        // ── .help <command> or .menu <command> ──────────────────────────────
        if (args.length) {
            const query = args.join(' ').toLowerCase().trim().replace(/^\./, '');
            const plugin = plugins.find(p => (p.commands || []).includes(query));
            if (plugin) {
                return safeSend({ text: buildCommandHelp(query, plugins, pfx), contextInfo }, { quoted: message });
            }
        }

        // ── .menu — single full categorized menu ────────────────────────────
        const menuText = buildFullMenu(plugins, pfx, botName, mode);

        try {
            await safeSend({ image: { url: imgUrl }, caption: menuText, contextInfo }, { quoted: message });
        } catch {
            await safeSend({ text: menuText, contextInfo }, { quoted: message });
        }
    }
};
