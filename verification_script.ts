
import { Assets } from "./lib/assets";

console.log("Checking Assets...");
const expectedKeys = [
    "imgArticleHero",
    "imgArticleBreakout",
    "imgStoryHistory",
    "imgStoryPolitics",
    "imgStoryCrime",
    "imgStoryCulture",
    "imgStoryArt",
    "imgStoryScience"
];

let hasError = false;
expectedKeys.forEach(key => {
    if (Assets[key as keyof typeof Assets] === undefined) {
        console.error(`ERROR: Assets.${key} is undefined!`);
        hasError = true;
    } else {
        console.log(`OK: Assets.${key} = ${Assets[key as keyof typeof Assets]}`);
    }
});

if (hasError) {
    process.exit(1);
} else {
    console.log("All expected keys present.");
}
