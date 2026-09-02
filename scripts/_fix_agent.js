'use strict';
const fs = require('fs');

let src = fs.readFileSync('plugins/silva-agent.js', 'utf8');

const newAskFreeAI = `// ── Free AI APIs: parallel race — ch.at primary, all backends race, first wins ──
async function askFreeAI(query, jid, systemPrompt) {
    const contextPrompt = jid ? buildContextPrompt(jid, query) : query;
    const fullPrompt    = systemPrompt
        ? systemPrompt + '\n\nUser: ' + contextPrompt
        : contextPrompt;

    const tryOne = async (fn) => {
        const r = await fn();
        if (r && String(r).trim().length > 2) return String(r).trim();
        throw new Error('empty');
    };

    try {
        return await Promise.any([
            tryOne(async () => {
                const res = await axios.post('https://ch.at/api/chat',
                    { message: fullPrompt },
                    { headers: { 'Content-Type': 'application/json', 'User-Agent': 'MalikMD-Bot/12.0' }, timeout: 10000 }
                );
                return res.data?.reply || res.data?.message || res.data?.response || res.data?.result || res.data?.text || null;
            }),
            tryOne(async () => {
                const res = await axios.get('https://api.paxsenix.biz.id/ai/gpt4o?text=' + encodeURIComponent(fullPrompt), { timeout: 10000 });
                return res.data?.message || res.data?.result || null;
            }),
            tryOne(async () => {
                const res = await axios.get('https://api.siputzx.my.id/api/ai/deepseek-r1?content=' + encodeURIComponent(fullPrompt), { timeout: 10000 });
                return res.data?.data || null;
            }),
            tryOne(async () => {
                const res = await axios.get('https://api.popcat.xyz/chatbot?msg=' + encodeURIComponent(query) + '&owner=' + encodeURIComponent(config.OWNER_NAME || 'Malik') + '&botname=Malik', { timeout: 8000 });
                return res.data?.response || null;
            }),
            tryOne(async () => {
                const res = await axios.get('https://api.paxsenix.biz.id/ai/claude?text=' + encodeURIComponent(fullPrompt), { timeout: 10000 });
                return res.data?.message || res.data?.result || null;
            }),
            tryOne(async () => {
                const res = await axios.get('https://vapis.my.id/api/openai?q=' + encodeURIComponent(fullPrompt), { timeout: 10000 });
                return res.data?.message || res.data?.result || res.data?.response || null;
            }),
            tryOne(async () => {
                const res = await axios.get('https://lance-frank-asta.onrender.com/api/gpt?q=' + encodeURIComponent(fullPrompt), { timeout: 10000 });
                return res.data?.message || res.data?.result || null;
            }),
        ]);
    } catch {
        return null;
    }
}`;

const askStart = src.indexOf('// \u2500\u2500 Free AI APIs (ch.at primary');
const askEnd   = src.indexOf('\nconst agentActions');
if (askStart !== -1 && askEnd !== -1) {
    src = src.slice(0, askStart) + newAskFreeAI + '\n\n' + src.slice(askEnd + 1);
    console.log('✅ askFreeAI replaced (parallel)');
}

fs.writeFileSync('plugins/silva-agent.js', src, 'utf8');
console.log('✅ File written, length:', src.length);
