import fm from "front-matter";
import { Octokit, Config, FrontMatter, File, Rule } from "../types";

export default async function (_octokit: Octokit, config: Config, files: File[] ) : Promise<Rule[]> {
    // Get results
    let res : Rule[][] = await Promise.all(files.map(async file => {
        if (!file.filename.endsWith(".md")) return [];

        let frontMatter = fm<FrontMatter>(file.previous_contents as string);

        if (["living", "final", "stagnant", "withdrawn"].includes(frontMatter.attributes?.status as string)) {
            return [{
                name: "terminal",
                reviewers: config.all,
                min: Math.floor(config.all.length / 2),
                annotation: {
                    file: file.filename
                }
            }];
        }

        return [];
    }));

    // Merge results
    let ret: Rule[] = [];
    res.forEach(val => ret.push(...val));
    return ret;
}
