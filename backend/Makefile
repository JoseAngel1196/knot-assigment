service_name = backend

.PHONY: lint
lint:
	poetry run pre-commit run --all-files

.PHONY: server-reload
server-reload:
	poetry run uvicorn --reload ${service_name}.app:app --host 0.0.0.0 --port 3000

.PHONY: setup-db
setup-db:
	poetry run python _scripts/setup_db.py

.PHONY: reset-db
reset-db:
	rm -f contacts.db
	poetry run python setup_db.py
