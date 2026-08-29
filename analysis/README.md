# Analysis

This directory contains analysis artifacts.

## aws-cost-analysis

A [marimo](https://docs.marimo.io/) interactive python notebook. The notebook utilizes marimo's
inline dependencies feature which is powered by uv, so you either need uv installed or make sure all
the dependencies are installed in the python environment some other way.

I installed uv following https://docs.astral.sh/uv/reference/installer/. Then from the
aws-cost-analysis directory I added a pyproject.toml file with the latest marimo version:

```
[project]
name = "aws-cost-analysis"
version = "1"
readme = "../README.md"
requires-python = ">=3.13"
dependencies = [
    "marimo>=0.14.12",
]
```

To launch the notebook to edit in browser:

`uv run marimo edit --sandbox notebook.py`
