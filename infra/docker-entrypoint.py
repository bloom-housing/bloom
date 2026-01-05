# Must work on the Python version contained in the awslinux base image.
#
# At current time of writing: 3.9.24
#
# To get the version for a particular image tag:
# `docker container run --rm -it --entrypoint python3 ghcr.io/bloom-housing/bloom/infra:<tag> --version`
#
# Formatted with yapf https://github.com/google/yapf with args:
# `--style='{based_on_style:google,SPLIT_BEFORE_FIRST_ARGUMENT:true,COLUMN_LIMIT=100}'`
import argparse
import subprocess
import sys


def run_subprocess(cmd, cwd=None, always_exit=False):
    """Runs a subprocess in a directory.

    If always_exit is True, the calling python process will be exited with the same code as the
    subprocess.

    If always_exit is False and the subprocess exited with a non-0 code, the calling python process
    will exited with a FATAL debug message.
    """
    cmd_formatted = " ".join(cmd)
    print(f"== docker-entrypoint.py: DIRECTORY='{cwd}', CMD='{cmd_formatted}'", flush=True)

    try:
        p = subprocess.Popen(cmd, cwd=cwd, stdin=sys.stdin, stdout=sys.stdout, stderr=sys.stderr)
        p.wait()
    except KeyboardInterrupt:
        # The subprocess will get the Interrupt signal without us needing to do anything, so just
        # wait on the subprocess to exit.
        p.wait()

    if always_exit:
        sys.exit(p.returncode)

    if p.returncode != 0:
        sys.exit(f"FATAL: '{cmd_formatted}' returned non-0 exit code.")


def main():
    # Valid root modules and their AWS CLI profile names:
    mod_to_aws_profile = {
        "bloom_dev": "bloom-dev-deployer",
        "bloom_dev_deployer_permission_set_policy": "bloom-dev-iam-admin",
        "bloom_prod": "bloom-prod-deployer",
        "bloom_prod_deployer_permission_set_policy": "bloom-prod-iam-admin",
    }

    p = argparse.ArgumentParser(
        prog="docker-entrypoint.py",
        description="CLI entrypoint for working with Bloom OpenTofu root modules.",
        allow_abbrev=True)

    p.add_argument(
        "-si", "--skip-init", help="Do not automatically run 'tofu init'.", action='store_true')
    p.add_argument(
        "-ss", "--skip-sso", help="Do not automatically run 'aws sso login'.", action='store_true')

    p.add_argument(
        "root_module_name",
        help="The root module name to work on.",
        choices=mod_to_aws_profile.keys())
    p.add_argument(
        "open_tofu_args",
        help="Arguments that are directly passed to the OpenTofu binary.",
        nargs=argparse.REMAINDER)

    args = p.parse_args()

    aws_profile = mod_to_aws_profile[args.root_module_name]
    mod_path = f"/infra/tofu_root_modules/{args.root_module_name}"

    if not args.skip_sso:
        run_subprocess(["aws", "sso", "login", "--use-device-code", "--profile", aws_profile])
    if not args.skip_init:
        run_subprocess(["tofu", "init"], cwd=mod_path)

    run_subprocess(["tofu"] + args.open_tofu_args, cwd=mod_path, always_exit=True)


if __name__ == '__main__':
    main()
