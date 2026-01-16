
import { getDb } from "./lib/db";
import { RowDataPacket } from "mysql2";

const MOCK_VIDEOS = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
];

async function updateVideos() {
    const db = getDb();
    console.log("Fetching all articles...");

    try {
        const [rows] = await db.query<RowDataPacket[]>("SELECT slug, title FROM posts");

        if (rows.length === 0) {
            console.log("No articles found in database.");
            process.exit(0);
        }

        console.log(`Found ${rows.length} articles. Updating with random videos...`);

        for (const row of rows) {
            const randomVideo = MOCK_VIDEOS[Math.floor(Math.random() * MOCK_VIDEOS.length)];

            await db.query(
                "UPDATE posts SET videoUrl = ? WHERE slug = ?",
                [randomVideo, row.slug]
            );

            console.log(`Updated '${row.title}' (${row.slug}) with video.`);
        }

        console.log("✅ All articles updated successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to update videos:", error);
        process.exit(1);
    }
}

updateVideos();
