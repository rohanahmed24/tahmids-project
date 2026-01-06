export async function hashPassword(password: string, salt: string | null = null): Promise<{ hash: string; salt: string }> {
    const encoder = new TextEncoder();

    // Generate or use provided salt
    let saltBytes;
    if (salt) {
        saltBytes = Uint8Array.from(salt.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
    } else {
        saltBytes = crypto.getRandomValues(new Uint8Array(16));
    }

    // Import the password key
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );

    // Derive the key using PBKDF2
    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: saltBytes,
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );

    // Export the key to get the raw bytes (hash)
    const exportedKey = await crypto.subtle.exportKey("raw", key);
    const hashHex = Array.from(new Uint8Array(exportedKey))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    const saltHex = Array.from(saltBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return { hash: hashHex, salt: saltHex };
}
