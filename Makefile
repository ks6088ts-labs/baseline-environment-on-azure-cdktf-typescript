# Git
GIT_REVISION ?= $(shell git rev-parse --short HEAD)
GIT_TAG ?= $(shell git describe --tags --abbrev=0 --always | sed -e s/v//g)

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
.DEFAULT_GOAL := help

.PHONY: install-deps-dev
install-deps-dev: ## install dependencies for development
	@# https://pnpm.io/installation
	@which pnpm || npm install -g pnpm
	@# https://developer.hashicorp.com/terraform/tutorials/cdktf/cdktf-install
	@which cdktf || npm install -g cdktf-cli
	pnpm install
	pnpm run get

.PHONY: fix
fix: ## fix code style
	pnpm run fix:prettier

.PHONY: lint
lint: ## lint
	pnpm run lint:prettier

.PHONY: test
test: ## run tests
	pnpm run test

.PHONY: build
build: ## build applications
	pnpm run build

.PHONY: synth
synth: ## synthesize the given stacks
	cdktf synth --hcl

.PHONY: ci-test
ci-test: install-deps-dev lint build synth test ## run CI test

.PHONY: plan
plan: ## perform a diff (terraform plan) for the given stack
	cdktf diff

.PHONY: apply
apply: ## create or update the given stacks
	cdktf deploy --auto-approve

.PHONY: destroy
destroy: ## destroy the given stacks
	cdktf destroy --auto-approve

.PHONY: update
update: ## update dependencies
	pnpm update
