import * as vscode from 'vscode';
import * as crypto from 'crypto';


export function activate(context: vscode.ExtensionContext) {

    let setKeyDisposable = vscode.commands.registerCommand('extension.setKey', async () => {
        const encryptionKey = await vscode.window.showInputBox({ prompt: 'Enter the encryption key' });
        if (!encryptionKey) {
            return;
        }

        const config = vscode.workspace.getConfiguration('encryption');
        await config.update('key', encryptionKey, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage('Encryption key saved.');
    });

    let setIVDisposable = vscode.commands.registerCommand('extension.setIV', async () => {
        const encryptionIV = await vscode.window.showInputBox({ prompt: 'Enter the encryption IV' });
        if (!encryptionIV) {
            return;
        }

        const config = vscode.workspace.getConfiguration('encryption');
        await config.update('iv', encryptionIV, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage('Encryption IV saved.');
    });

    let decryptDisposable = vscode.commands.registerCommand('extension.decrypt', async () => {
        const config = vscode.workspace.getConfiguration('encryption');
        const encryptionKey = config.get('key') as string;
        const encryptionIV = config.get('iv') as string;

        if (!encryptionKey || !encryptionIV) {
            vscode.window.showErrorMessage('Encryption key or IV not set.');
            return;
        }

        const encryptedText = await vscode.window.showInputBox({ prompt: 'Paste the encrypted text' });
        if (!encryptedText) {
            return;
        }

        try {
            const decryptedText = decrypt(encryptedText, encryptionKey, encryptionIV);
            vscode.window.showInformationMessage(`Decrypted text: ${decryptedText}`);
        } catch (error) {
            vscode.window.showErrorMessage('Failed to decrypt the text.');
        }
    });

    context.subscriptions.push(setKeyDisposable, setIVDisposable, decryptDisposable);
}


export function deactivate() {}

function decrypt(encryptedText: string, key: string, iv: string): string {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(Buffer.from(encryptedText, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
