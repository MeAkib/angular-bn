/**
 * @fileoverview GitHub Actions script to sync untranslated files tracking issue
 */

/**
 * @typedef {Object} UntranslatedFile
 * @property {string} path - File path relative to adev-bn
 * @property {string} category - File category (guide, tutorial, etc.)
 * @property {string} extension - File extension without dot
 * @property {string|null} url - URL path on angular.bd, null when the file has no page
 */

/**
 * @typedef {Object} FilesData
 * @property {number} count - Total number of untranslated files
 * @property {UntranslatedFile[]} files - Array of untranslated files
 * @property {string[]} orphaned - Files skipped because they have no route on the site
 */

/**
 * @typedef {Object} FileLinks
 * @property {string} githubUrl - GitHub blob URL
 * @property {string|null} previewUrl - Preview URL on angular.bd (null when the file has no page)
 * @property {string} issueUrl - Issue creation URL with pre-filled title
 */

/**
 * @typedef {Object} GitHubContext
 * @property {Object} repo
 * @property {string} repo.owner - Repository owner
 * @property {string} repo.repo - Repository name
 */

/**
 * @typedef {Object} GitHubAPI
 * @property {Object} rest
 * @property {Object} rest.issues
 * @property {Function} rest.issues.listForRepo
 * @property {Function} rest.issues.create
 * @property {Function} rest.issues.update
 */

/**
 * @typedef {Object} ActionsCore
 * @property {Function} info - Log info message
 */

const ISSUE_TITLE = 'Tracking: Untranslated documents';
const LABELS = ['type: translation', 'help wanted'];

/** @type {Record<string, string>} */
const CATEGORY_EMOJIS = {
  introduction: '🚀 Introduction',
  guide: '📖 Guide',
  tutorial: '🎓 Tutorial',
  reference: '📚 Reference',
  'best-practices': '⚡ Best Practices',
  ai: '🤖 AI',
  cli: '🔧 CLI',
  tools: '🛠️ Tools',
  ecosystem: '🌐 Ecosystem',
  events: '📅 Events',
  app: '🧩 Components/App',
  other: '📦 Other'
};

/** @type {string[]} */
const CATEGORY_ORDER = ['introduction', 'guide', 'tutorial', 'reference', 'best-practices', 'ai', 'cli', 'tools', 'ecosystem', 'events', 'app', 'other'];

/**
 * Identify a file the way a Translation Checkout issue title spells it out:
 * the path without the src/content/ prefix and without the extension.
 * @param {string} filepath - File path relative to adev-bn
 * @returns {string} Declaration key
 */
export function toDeclarationKey(filepath) {
  return filepath
    .replace(/^src\/content\//, '')
    .replace(/\.(md|ts|html|json)$/, '')
    .replace(/\/+$/, ''); // directory-level declarations may end with /
}

/**
 * Map each untranslated file to the Translation Checkout issue that claims it.
 * A declaration may name one file or a whole directory, but it only ever claims
 * files under a path boundary — `guide/signals` must not claim `guide/signals-rfc.md`.
 * @param {{number: number, title: string}[]} checkoutIssues - Open Translation Checkout issues
 * @param {UntranslatedFile[]} files - Untranslated files
 * @returns {Map<string, number>} File path to issue number
 */
export function buildCheckoutIssuesMap(checkoutIssues, files) {
  const map = new Map();
  for (const issue of checkoutIssues) {
    // Title format: "translate: {path without extension}"
    const match = issue.title.match(/^translate:\s*(\S.*?)\s*$/);
    if (!match) continue;
    const declared = toDeclarationKey(match[1]);
    if (!declared) continue;
    for (const file of files) {
      const key = toDeclarationKey(file.path);
      if (key === declared || key.startsWith(`${declared}/`)) {
        map.set(file.path, issue.number);
      }
    }
  }
  return map;
}

/**
 * Generate URLs for a file
 * @param {UntranslatedFile} file - Untranslated file entry
 * @returns {FileLinks} Object containing GitHub, preview, and issue URLs
 */
function generateLinks(file) {
  const githubUrl = `https://github.com/MeAkib/angular-bn/blob/main/adev-bn/${file.path}`;

  const issueUrl = `https://github.com/MeAkib/angular-bn/issues/new?template=translation-checkout.md&title=${encodeURIComponent('translate: ' + toDeclarationKey(file.path))}`;

  // Only files with a page of their own get a preview URL
  const previewUrl = file.url ? `https://angular.bd/${file.url}` : null;

  return { githubUrl, previewUrl, issueUrl };
}

/**
 * Format a file entry for the issue body
 * @param {string} filepath - File path relative to adev-bn
 * @param {FileLinks} links - Object containing URLs for the file
 * @param {number|null} checkoutIssueNumber - Translation Checkout issue number if exists
 * @returns {string} Markdown formatted list item
 */
function formatFileEntry(filepath, links, checkoutIssueNumber = null) {
  const displayName = filepath.replace('src/content/', '');

  let linksText = `[GitHub](${links.githubUrl})`;
  if (links.previewUrl) {
    linksText += ` | [Preview](${links.previewUrl})`;
  }

  if (checkoutIssueNumber) {
    linksText += ` | #${checkoutIssueNumber}`;
    return `- [x] ${displayName} (${linksText})`;
  } else {
    linksText += ` | [📝 Claim](${links.issueUrl})`;
    return `- [ ] ${displayName} (${linksText})`;
  }
}

/**
 * Group files by category
 * @param {UntranslatedFile[]} files - Array of untranslated files
 * @returns {Record<string, UntranslatedFile[]>} Files grouped by category
 */
function groupByCategory(files) {
  const groups = {};
  for (const file of files) {
    const category = file.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(file);
  }
  return groups;
}

/**
 * Keep skipped files visible in the body; silently dropping them hides untranslated work.
 * @param {string[]|undefined} orphaned - Files with no page of their own
 * @returns {string} Markdown line, empty when nothing was skipped
 */
function formatOrphanedNote(orphaned) {
  if (!orphaned?.length) return '';
  const list = orphaned.map(f => `\`${f.replace('src/content/', '')}\``).join(', ');
  return `**Not tracked**: ${orphaned.length} file(s) with no page on the site: ${list}\n`;
}

/**
 * Generate issue body
 * @param {FilesData} filesData - Object containing untranslated files data
 * @param {Map<string, number>} checkoutIssuesMap - Map of file paths to issue numbers
 * @returns {string} Markdown formatted issue body
 */
function generateIssueBody(filesData, checkoutIssuesMap) {
  const { count, files } = filesData;

  if (count === 0) {
    return `## 🎉 All files are translated!

**Last updated**: ${new Date().toISOString()}

There are no untranslated files right now. Thank you for the amazing contributions!

---

## 📝 Translation guide

When new untranslated files appear upstream, this issue updates automatically.

- [Contributing guide](https://github.com/MeAkib/angular-bn/blob/main/CONTRIBUTING.md)
`;
  }

  const groups = groupByCategory(files);

  let body = `## 📋 Untranslated documents

This issue updates automatically. To claim a file, open a Translation Checkout issue from its "📝 Claim" link.

**Last updated**: ${new Date().toISOString()}
**Untranslated files**: ${count}
${formatOrphanedNote(filesData.orphaned)}
---

`;

  // Emit sections in category order
  for (const category of CATEGORY_ORDER) {
    if (!groups[category] || groups[category].length === 0) continue;

    const categoryFiles = groups[category];
    const emoji = CATEGORY_EMOJIS[category] || category;

    body += `### ${emoji} (${categoryFiles.length})\n\n`;

    for (const file of categoryFiles) {
      const links = generateLinks(file);
      const checkoutIssueNumber = checkoutIssuesMap.get(file.path) || null;
      body += formatFileEntry(file.path, links, checkoutIssueNumber) + '\n';
    }

    body += '\n';
  }

  body += `---

## 📝 How to start translating

1. Pick a file from the list above
2. Click its "📝 Claim" link to open a Translation Checkout issue
3. Follow the [contributing guide](https://github.com/MeAkib/angular-bn/blob/main/CONTRIBUTING.md)
`;

  return body;
}

/**
 * Main function
 * @param {Object} params - Parameters
 * @param {GitHubAPI} params.github - GitHub API instance
 * @param {GitHubContext} params.context - GitHub Actions context
 * @param {ActionsCore} params.core - GitHub Actions core utilities
 * @param {FilesData} params.filesData - Untranslated files data
 * @returns {Promise<void>}
 */
export default async ({github, context, core, filesData}) => {
  const owner = context.repo.owner;
  const repo = context.repo.repo;

  core.info(`Processing ${filesData.count} untranslated files...`);
  if (filesData.orphaned?.length) {
    core.info(`Skipped ${filesData.orphaned.length} files with no route: ${filesData.orphaned.join(', ')}`);
  }

  // Fetch all open Translation Checkout issues.
  // Without paginate the default 30 cut off claimed files from the list.
  const checkoutIssues = await github.paginate(github.rest.issues.listForRepo, {
    owner,
    repo,
    state: 'open',
    labels: 'type: Translation Checkout',
    per_page: 100
  });

  core.info(`Found ${checkoutIssues.length} Translation Checkout issues`);

  const checkoutIssuesMap = buildCheckoutIssuesMap(checkoutIssues, filesData.files);

  core.info(`Mapped ${checkoutIssuesMap.size} files to checkout issues`);

  // Find the existing tracking issue (state: all includes closed ones).
  // Without paginate the tracking issue can be missed as issues grow, causing duplicates.
  const issues = await github.paginate(github.rest.issues.listForRepo, {
    owner,
    repo,
    state: 'all',
    labels: LABELS[0],
    creator: 'github-actions[bot]',
    per_page: 100
  });

  const trackingIssue = issues.find(issue => issue.title === ISSUE_TITLE);

  const issueBody = generateIssueBody(filesData, checkoutIssuesMap);

  if (trackingIssue) {
    core.info(`Found existing tracking issue #${trackingIssue.number}`);

    // Update the issue (title too, migrating old formats)
    await github.rest.issues.update({
      owner,
      repo,
      issue_number: trackingIssue.number,
      title: ISSUE_TITLE,
      body: issueBody,
      state: 'open' // reopen if it was closed
    });

    core.info(`Updated tracking issue #${trackingIssue.number}`);

    if (trackingIssue.state === 'closed') {
      core.info(`Reopened tracking issue #${trackingIssue.number}`);
    }
  } else {
    // Create a new issue
    const { data: newIssue } = await github.rest.issues.create({
      owner,
      repo,
      title: ISSUE_TITLE,
      body: issueBody,
      labels: LABELS
    });

    core.info(`Created new tracking issue #${newIssue.number}`);
  }

  core.info('Done!');
};
