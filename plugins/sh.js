'use strict';

const { execFile } = require('child_process');

function parseCommand(cmdString) {
    const matches = cmdString.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    return matches.map(arg => {
        if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
            return arg.slice(1, -1);
        }
        return arg;
    });
}

function shell(cmd) {
    return new Promise((resolve) => {
        const parts = parseCommand(cmd);
        if (parts.length === 0) {
            return resolve({ stdout: '', stderr: 'No command specified', code: 1 });
        }
        const file = parts[0];
        const args = parts.slice(1);

        execFile(file, args, { timeout: 20000, maxBuffer: 1024 * 1024 * 4, cwd: process.cwd() }, (err, stdout, stderr) => {
            const exitCode = typeof err?.code === 'number' ? err.code : (err ? 1 : 0);
            resolve({ stdout: (stdout || '').trim(), stderr: (stderr || (err?.message ?? '')).trim(), code: exitCode });
        });
    });
}

module.exports = {
    commands:    ['sh', 'cmd', 'bash', 'terminal', 'shell'],
    description: 'Run a shell/terminal command on the server (owner only)',
    usage:       '.sh <command>  e.g. `.sh ls plugins | wc -l`',
    permission:  'owner',
    group:       true,
    private:     true,
    shell,
    parseCommand,

    run: async (sock, message, args, ctx) => {
        const { jid, contextInfo, isOwner, reply } = ctx;
        if (!isOwner) return reply('⛔ Owner only.');

        const cmd = args.join(' ').trim();
        if (!cmd) return sock.sendMessage(jid, {
            text: '❌ No command given.\n\n*Examples:*\n`.sh ls plugins | wc -l`\n`.sh node --version`\n`.sh cat config.js | head -20`',
            contextInfo
        }, { quoted: message });

        await sock.sendMessage(jid, { text: `⏳ Running: \`${cmd}\``, contextInfo }, { quoted: message });

        const start = Date.now();
        const { stdout, stderr, code } = await shell(cmd);
        const elapsed = Date.now() - start;

        const output   = stdout || stderr || '(no output)';
        const trimmed  = output.length > 3500 ? output.slice(0, 3500) + '\n…[truncated]' : output;
        const icon     = code === 0 ? '✅' : '⚠️';

        return sock.sendMessage(jid, {
            text: `${icon} *Shell Output* _(${elapsed}ms | exit ${code})_\n\`\`\`\n${trimmed}\n\`\`\``,
            contextInfo
        }, { quoted: message });
    }
};
