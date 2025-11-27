from pathlib import Path
from crewai import Crew, Process
from .protocol_factory_agents import medical_expert, developer, integrator, auditor
from .protocol_factory_tasks import (
    medical_research_task,
    component_impl_task,
    integration_task,
    audit_task,
)

def load_protocol_names(filepath: str = ".agent/protocols_to_create.txt") -> list[str]:
    path = Path(filepath)
    if not path.exists():
        return []
    return [
        line.strip()
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]

def run_protocol_factory_for_one(protocol_name: str):
    """
    Exécute le pipeline multi-agents pour un protocole donné.

    `protocol_name` doit être le libellé clinique humain
    (ex: 'Choc septique pédiatrique').
    """
    crew = Crew(
        agents=[medical_expert, developer, integrator, auditor],
        tasks=[medical_research_task, component_impl_task, integration_task, audit_task],
        process=Process.sequential,  # Step 2 -> Step 3 -> Step 4 -> Step 5
        verbose=True,
    )

    result = crew.kickoff(inputs={"protocol_name": protocol_name})
    return result

def run_protocol_factory_batch():
    """
    Lit .agent/protocols_to_create.txt et exécute le workflow pour chaque protocole.
    """
    protocols = load_protocol_names()
    results: dict[str, str] = {}
    for name in protocols:
        print(f"\n=== Processing protocol: {name} ===\n")
        results[name] = run_protocol_factory_for_one(name)
    return results

if __name__ == "__main__":
    run_protocol_factory_batch()
