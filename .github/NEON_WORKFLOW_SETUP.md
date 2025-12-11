# Neon Branch Workflow Setup Guide

This guide explains how to set up GitHub Actions workflows for automatic Neon database branch creation/deletion on pull requests.

## 📋 Prerequisites

1. **Neon Account**: You need a Neon account with a project
2. **Neon API Key**: Get your API key from [Neon Console](https://console.neon.tech/)
3. **GitHub Repository**: Your code must be in a GitHub repository

## 🔧 Setup Steps

### Step 1: Get Your Neon Project ID

1. Go to [Neon Console](https://console.neon.tech/)
2. Select your project
3. Go to **Settings** → **General**
4. Copy your **Project ID** (looks like: `ep-xxxxx-xxxxx`)

### Step 2: Get Your Neon API Key

1. In Neon Console, go to **Account Settings** → **Developer Settings**
2. Click **Create API Key**
3. Give it a name (e.g., "GitHub Actions")
4. Copy the API key (starts with `neon_`)

### Step 3: Configure GitHub Secrets and Variables

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**

#### Add Secret:
- **Name:** `NEON_API_KEY`
- **Value:** Your Neon API key (from Step 2)

#### Add Variable:
- **Name:** `NEON_PROJECT_ID`
- **Value:** Your Neon Project ID (from Step 1)

## 📁 Workflow Files

Two workflow files are available:

### 1. `neon-branch-pr.yml` (Basic)
- Creates/deletes Neon branches for PRs
- No migrations or schema diffs
- Use this if you just need branch management

### 2. `neon-branch-pr-with-migrations.yml` (Advanced)
- Creates/deletes Neon branches
- Runs database migrations automatically
- Seeds database (optional)
- Posts schema diff comments to PRs
- Use this for full CI/CD integration

## 🚀 How It Works

### When a PR is Opened/Updated:
1. Workflow creates a new Neon branch named: `preview/pr-{PR_NUMBER}-{BRANCH_NAME}`
2. Branch expires automatically after 14 days
3. (Advanced) Runs migrations and seeds database
4. (Advanced) Posts schema diff to PR comment

### When a PR is Closed:
1. Workflow automatically deletes the Neon branch
2. Cleans up resources

## 🔍 Example Branch Names

- PR #42 from branch `feature/new-courses` → `preview/pr-42-feature-new-courses`
- PR #15 from branch `fix/enrollment-bug` → `preview/pr-15-fix-enrollment-bug`

## 🧪 Testing the Workflow

1. Create a test branch:
   ```bash
   git checkout -b test/neon-workflow
   ```

2. Make a small change and commit:
   ```bash
   git commit --allow-empty -m "Test Neon workflow"
   ```

3. Push and create a PR:
   ```bash
   git push origin test/neon-workflow
   ```

4. Check GitHub Actions tab to see the workflow run

5. Check Neon Console to see the new branch created

## 📊 Monitoring

### Check Workflow Status:
- Go to **Actions** tab in your GitHub repository
- Click on the workflow run to see details

### Check Neon Branches:
- Go to [Neon Console](https://console.neon.tech/)
- Select your project
- Go to **Branches** to see all preview branches

## 🐛 Troubleshooting

### Workflow Fails to Create Branch

**Error:** "Project not found"
- ✅ Check `NEON_PROJECT_ID` variable is set correctly
- ✅ Verify the project ID in Neon console

**Error:** "Unauthorized"
- ✅ Check `NEON_API_KEY` secret is set correctly
- ✅ Verify the API key is valid and not expired

### Migrations Fail

**Error:** "Cannot connect to database"
- ✅ Check the DATABASE_URL is being set correctly
- ✅ Verify the Neon branch was created successfully
- ✅ Check migration scripts are correct

### Schema Diff Not Showing

**Error:** "Permission denied"
- ✅ Ensure workflow has `pull-requests: write` permission
- ✅ Check the permissions block in workflow file

## 🔐 Security Notes

- ⚠️ **Never commit API keys or secrets to the repository**
- ✅ Always use GitHub Secrets for sensitive data
- ✅ The workflow automatically masks DATABASE_URL in logs
- ✅ Branches expire after 14 days automatically

## 📚 Additional Resources

- [Neon Branching Documentation](https://neon.tech/docs/guides/branching)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Neon API Documentation](https://neon.tech/docs/api-reference)

## ✅ Verification Checklist

- [ ] Neon API key added to GitHub Secrets
- [ ] Neon Project ID added to GitHub Variables
- [ ] Workflow file committed to repository
- [ ] Test PR created to verify workflow
- [ ] Neon branch created successfully
- [ ] (If using advanced) Migrations run successfully
- [ ] (If using advanced) Schema diff posted to PR

---

**Last Updated:** December 10, 2025

