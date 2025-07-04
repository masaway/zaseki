# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ルール
- 常に日本語で返答すること
- ドキュメントは日本語でまとめること
- ライブラリ周りを調べるときはcontext7を参照すること
- 企画書やドキュメントは、`docs`ディレクトリにまとめること
- playwrightでのテストは指示があったときのみ行うこと
- アプリディレクトリはzaseki-app配下にあるので、アプリ関連はこのディレクトリを参照すること

## 座席表システムの重要原則
- **座席配置は実際のオフィスレイアウトに対応**: 銀河などの装飾的な配置は禁止
- **現実の座席位置を忠実に反映**: ユーザーがリアルオフィスでの実際の位置を把握できること
- **装飾は背景のみ**: 座席位置は現実のセクション・デスク配置に従う
- **StarMapビューでも実座席位置**: 縮小表示でも実際の相対位置を維持


## Project Overview

This is the `zaseki` project within a Docker-based Claude Code development environment. The project appears to be in its initial setup phase with a planning document (`企画書.md`) as the primary content.

## Docker Environment

This project runs within a containerized development environment:

- **Container**: Based on Node.js 18 with Claude Code CLI pre-installed
- **Working Directory**: `/workspace` (projects are mounted here)
- **Pre-installed Tools**: Claude Code CLI, ripgrep, Git, SSH
- **Environment Access**: Via VS Code Remote Containers or direct Docker container access

## Environment Management

### Starting the Development Environment
```bash
# From WSL2/Ubuntu
cd /home/yoshiaki/00_work/ClaudeCodeDocker
docker compose up -d
```

### Accessing the Environment
- Use VS Code Remote Development extension
- Connect to WSL: Ubuntu → Containers → claude-code container
- Or use direct Docker exec access

### Stopping the Environment
```bash
# Recommended method (preserves data)
docker compose stop

# ⚠️ Avoid: docker compose down (may lose data)
```

## Project Structure

The current `zaseki` project structure:
```
/workspace/ClaudeCodeDocker/zaseki/
├── 企画書.md (empty planning document)
└── CLAUDE.md (this file)
```

## Development Workflow

1. **Project Location**: All projects are located in `/workspace`
2. **Multi-project Support**: The container supports multiple projects simultaneously
3. **SSH Access**: SSH keys are mounted from host system for Git operations
4. **Persistent Storage**: Claude settings and SSH keys persist across container restarts

## Environment Commands

Since this is a containerized environment, standard Docker commands apply:
- `docker ps` - Check running containers
- `ls /workspace` - List all projects in the environment
- `claude` - Start Claude Code CLI (from within project directory)

## Notes

- This is a shared development container that can host multiple projects
- The environment is optimized for AI-driven development with Claude Code
- SSH keys are automatically configured for GitHub and GitLab
- Container data persists between restarts (except when using `docker compose down`)