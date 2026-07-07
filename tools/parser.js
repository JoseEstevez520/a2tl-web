// parser.js — UIDL v1 parser (UIDL text → JSON spec)
const COLORS = new Set([
    'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'cyan', 'pink', 'white', 'black',
    'gray', 'grey', 'indigo', 'teal', 'emerald', 'amber', 'rose', 'violet', 'lime', 'sky',
    'slate', 'zinc', 'neutral', 'stone', 'fuchsia'
]);
function isColor(val) {
    if (typeof val !== 'string')
        return false;
    return COLORS.has(val.toLowerCase()) || /^#[0-9a-fA-F]{3,8}$/.test(val);
}
function tokenizeLine(line) {
    const tokens = [];
    let i = 0;
    while (i < line.length) {
        if (line[i] === ' ' || line[i] === '\t') {
            i++;
            continue;
        }
        if (line[i] === '"') {
            i++;
            let str = '';
            while (i < line.length && line[i] !== '"') {
                str += line[i];
                i++;
            }
            if (i < line.length)
                i++;
            tokens.push(str);
        }
        else {
            let tok = '';
            while (i < line.length && line[i] !== ' ' && line[i] !== '\t') {
                tok += line[i];
                i++;
            }
            const num = Number(tok);
            tokens.push(tok !== '' && !isNaN(num) ? num : tok);
        }
    }
    return tokens;
}
function getIndent(line) {
    let n = 0;
    for (const ch of line) {
        if (ch === ' ')
            n++;
        else if (ch === '\t')
            n += 2;
        else
            break;
    }
    return n;
}
export function parseUIDL(text) {
    const lines = text.split(/\r?\n/);
    const result = { version: 1, theme: 'light', layout: 'stack', title: '', sections: [] };
    let i = 0;
    const skip = () => { while (i < lines.length && (lines[i].trim() === '' || lines[i].trim().startsWith('//')))
        i++; };
    skip();
    if (i < lines.length && lines[i].trim().startsWith('UIDL/')) {
        result.version = parseInt(lines[i].trim().split('/')[1]) || 1;
        i++;
        skip();
    }
    while (i < lines.length) {
        skip();
        if (i >= lines.length)
            break;
        if (getIndent(lines[i]) > 0)
            break;
        const t = tokenizeLine(lines[i]);
        const cmd = String(t[0] || '').toLowerCase();
        if (cmd === 'theme') {
            result.theme = String(t[1] || 'light');
            i++;
        }
        else if (cmd === 'layout') {
            result.layout = String(t[1] || 'stack');
            i++;
        }
        else if (cmd === 'title') {
            result.title = String(t[1] || '');
            i++;
        }
        else
            break;
    }
    while (i < lines.length) {
        skip();
        if (i >= lines.length)
            break;
        if (getIndent(lines[i]) > 0) {
            i++;
            continue;
        }
        const t = tokenizeLine(lines[i]);
        const cmd = String(t[0] || '').toLowerCase();
        if (cmd === 'h1' || cmd === 'h2' || cmd === 'h3') {
            result.sections.push({ type: cmd, text: String(t[1] || '') });
            i++;
            continue;
        }
        if (cmd === 'text') {
            const sec = { type: 'text', text: String(t[1] || '') };
            if (t[2])
                sec.style = String(t[2]);
            i++;
            while (i < lines.length && lines[i].trim() !== '' && getIndent(lines[i]) > 0) {
                sec.text += '\n' + lines[i].trim();
                i++;
            }
            result.sections.push(sec);
            continue;
        }
        if (cmd === 'hr' || cmd === '---') {
            result.sections.push({ type: 'hr' });
            i++;
            continue;
        }
        if (cmd === 'metrics') {
            const cols = typeof t[1] === 'number' ? t[1] : 3;
            const items = [];
            i++;
            while (i < lines.length && lines[i].trim() !== '' && getIndent(lines[i]) > 0) {
                const mt = tokenizeLine(lines[i]);
                const item = { label: String(mt[0] || ''), value: String(mt[1] || '') };
                if (mt[2] && isColor(mt[2])) {
                    item.color = String(mt[2]);
                    if (mt[3])
                        item.note = String(mt[3]);
                }
                else if (mt[2]) {
                    item.note = String(mt[2]);
                }
                items.push(item);
                i++;
            }
            result.sections.push({ type: 'metrics', cols, items });
            continue;
        }
        if (cmd === 'chart') {
            const chartType = String(t[1] || 'bar');
            const sec = { type: 'chart', chartType, title: t[2] ? String(t[2]) : '', x: [], series: [], pieData: undefined };
            let y;
            i++;
            while (i < lines.length && lines[i].trim() !== '' && getIndent(lines[i]) > 0) {
                const ct = tokenizeLine(lines[i]);
                const sub = String(ct[0] || '').toLowerCase();
                if (sub === 'title') {
                    sec.title = String(ct[1] || '');
                }
                else if (sub === 'x' || sub === 'axes') {
                    sec.x = ct.slice(1);
                }
                else if (sub === 'y') {
                    y = ct.slice(1).filter((v) => typeof v === 'number');
                }
                else if (sub === 'series') {
                    const name = String(ct[1] || '');
                    const rest = ct.slice(2);
                    const lastVal = rest[rest.length - 1];
                    const hasColor = rest.length > 0 && isColor(lastVal);
                    const color = hasColor ? String(rest.pop()) : undefined;
                    const data = rest.map(Number).filter(n => !isNaN(n));
                    sec.series.push({ name, data, ...(color ? { color } : {}) });
                }
                else if (sub === 'color') {
                    sec.color = String(ct[1] || '');
                }
                else if (chartType === 'pie' || chartType === 'donut') {
                    if (!sec.pieData)
                        sec.pieData = [];
                    const label = String(ct[0] || '');
                    const value = typeof ct[1] === 'number' ? ct[1] : parseFloat(String(ct[1])) || 0;
                    const color = ct[2] && isColor(ct[2]) ? String(ct[2]) : undefined;
                    sec.pieData.push({ label, value, ...(color ? { color } : {}) });
                }
                i++;
            }
            if (y && sec.series.length === 0) {
                sec.series.push({ name: sec.title || 'Value', data: y });
            }
            result.sections.push(sec);
            continue;
        }
        if (cmd === 'table') {
            const sec = { type: 'table', title: t[1] ? String(t[1]) : '', columns: [], rows: [] };
            i++;
            while (i < lines.length && lines[i].trim() !== '' && getIndent(lines[i]) > 0) {
                const tt = tokenizeLine(lines[i]);
                const sub = String(tt[0] || '').toLowerCase();
                if (sub === 'cols') {
                    sec.columns = tt.slice(1).map(String);
                }
                else if (sub === 'row') {
                    sec.rows.push(tt.slice(1));
                }
                i++;
            }
            result.sections.push(sec);
            continue;
        }
        if (cmd === 'cards') {
            const cols = typeof t[1] === 'number' ? t[1] : 3;
            const items = [];
            i++;
            while (i < lines.length && lines[i].trim() !== '' && getIndent(lines[i]) > 0) {
                const ct = tokenizeLine(lines[i]);
                if (String(ct[0]).toLowerCase() === 'card') {
                    items.push({ title: String(ct[1] || ''), subtitle: String(ct[2] || ''), value: ct[3] !== undefined ? String(ct[3]) : '' });
                }
                i++;
            }
            result.sections.push({ type: 'cards', cols, items });
            continue;
        }
        if (cmd === 'list') {
            const sec = { type: 'list', title: t[1] ? String(t[1]) : '', items: [] };
            i++;
            while (i < lines.length && lines[i].trim() !== '' && getIndent(lines[i]) > 0) {
                const lt = tokenizeLine(lines[i]);
                const first = String(lt[0] || '');
                sec.items.push((first === '-' || first === '*') ? lt.slice(1).map(String).join(' ') : lt.map(v => String(v)).join(' '));
                i++;
            }
            result.sections.push(sec);
            continue;
        }
        if (cmd === 'code') {
            const lang = t[1] ? String(t[1]) : '';
            const codeLines = [];
            i++;
            while (i < lines.length && getIndent(lines[i]) > 0) {
                codeLines.push(lines[i].replace(/^ {2}/, ''));
                i++;
            }
            result.sections.push({ type: 'code', lang, text: codeLines.join('\n') });
            continue;
        }
        if (cmd === 'collapse') {
            const contentLines = [];
            i++;
            while (i < lines.length && getIndent(lines[i]) > 0) {
                contentLines.push(lines[i].trimStart());
                i++;
            }
            result.sections.push({ type: 'collapse', title: t[1] ? String(t[1]) : 'Details', content: contentLines.join('\n') });
            continue;
        }
        i++;
    }
    if (!result.title) {
        const h1 = result.sections.find(s => s.type === 'h1');
        if (h1)
            result.title = h1.text;
    }
    return result;
}
