"""
   ██████╗ █████╗ ███████╗ █████╗ ██╗     ██╗███╗   ██╗ ██████╗ ██╗   ██╗ █████╗ 
  ██╔════╝██╔══██╗██╔════╝██╔══██╗██║     ██║████╗  ██║██╔════╝ ██║   ██║██╔══██╗
  ██║     ███████║███████╗███████║██║     ██║██╔██╗ ██║██║  ███╗██║   ██║███████║
  ██║     ██╔══██║╚════██║██╔══██║██║     ██║██║╚██╗██║██║   ██║██║   ██║██╔══██║
  ╚██████╗██║  ██║███████║██║  ██║███████╗██║██║ ╚████║╚██████╔╝╚██████╔╝██║  ██║
   ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝

   CasaLingua - Where Language Feels Like Home
   Version: 0.20.1
   Author: TEAM 1 – James Wilson
   License: MIT
   Description: CLI diagnostics tool for CasaLingua to report system status,
                recommend optimal model runtime settings, and display environment.
"""

from optimize import detect_environment, recommend_defaults
from rich.console import Console
from rich.table import Table
from rich import box

console = Console()

def run_diagnostics():
    env = detect_environment()
    reco = recommend_defaults(env)

    console.rule("[bold cyan]CasaLingua Diagnostics Report")

    env_table = Table(title="System Environment", box=box.SIMPLE_HEAVY)
    env_table.add_column("Key", style="bold magenta")
    env_table.add_column("Value", style="bold white")
    for k, v in env.items():
        env_table.add_row(k, str(v))
    console.print(env_table)

    rec_table = Table(title="CasaLingua Optimization Suggestions", box=box.SIMPLE_HEAVY)
    rec_table.add_column("Component", style="green")
    rec_table.add_column("Recommended Setting", style="bold yellow")
    for k, v in reco.items():
        rec_table.add_row(k, v)
    console.print(rec_table)

    console.rule("[bold green]Status: Ready")

if __name__ == "__main__":
    run_diagnostics()
