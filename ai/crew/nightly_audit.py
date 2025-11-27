from pathlib import Path
from crewai import Crew, Process, Task
from .protocol_factory_agents import auditor

# Tâche d’audit de flow existant
flow_audit_task = Task(
    name="ExistingFlowAuditTask",
    description=(
        "Tu reçois le contenu d’un composant React/TSX ProtocolFlow existant de PediaGo "
        "via la variable `flow_source`.\n"
        "Ta mission : auditer ce flow côté sécurité médicale et qualité technique.\n\n"
        "Vérifie :\n"
        "- Que les calculs de doses sont cohérents et ne semblent pas aberrants.\n"
        "- Qu’aucun volume non nul n’est arrondi à 0 mL.\n"
        "- Qu’il n’y a pas de type `any`.\n"
        "- Que les helpers (dosing/formatages) sont utilisés pour l’affichage et les calculs.\n"
        "- Que la structure du composant est cohérente avec les standards PediaGo "
        "(séparation logique/JSX, utilisation de FlowBlock, FlowRibbon, FlowChevron, etc.).\n\n"
        "Rends un rapport concis avec :\n"
        "- 'OK' si rien de critique n’est détecté.\n"
        "- Sinon : 'Issues found:' suivi de la liste des anomalies."
    ),
    expected_output=(
        "Un rapport d’audit court : soit 'OK', soit 'Issues found: ...' avec détails."
    ),
    agent=auditor,
)

def list_protocol_flow_files(root: str = "src/components") -> list[Path]:
    base = Path(root)
    return sorted(base.glob("ProtocolFlow*.tsx"))

def audit_all_flows():
    flows = list_protocol_flow_files()
    results: dict[str, str] = {}

    for path in flows:
        print(f"\n=== Auditing flow: {path} ===\n")
        content = path.read_text(encoding="utf-8")

        crew = Crew(
            agents=[auditor],
            tasks=[flow_audit_task],
            process=Process.sequential,
            verbose=True,
        )
        result = crew.kickoff(inputs={"flow_source": content})
        results[str(path)] = str(result)

    # écrire un rapport global
    report_path = Path("ai/reports/nightly_flow_audit.txt")
    report_path.parent.mkdir(parents=True, exist_ok=True)
    with report_path.open("w", encoding="utf-8") as f:
        for file_path, audit in results.items():
            f.write(f"=== {file_path} ===\n{audit}\n\n")

    print(f"\nNightly audit report written to: {report_path}\n")
    return results

if __name__ == "__main__":
    audit_all_flows()
