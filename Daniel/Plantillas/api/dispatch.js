export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    const { fecha, markdown } = req.body;

    const repo = process.env.REPO; // ej: "usuario/repo"
    const workflowId = "guardar-notas.yml";

    try {
        const resp = await fetch(
            `https://api.github.com/repos/${repo}/actions/workflows/${workflowId}/dispatches`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
                    "Accept": "application/vnd.github+json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ref: "main", // rama
                    inputs: { fecha, markdown }
                })
            }
        );

        if (resp.ok) {
            res.status(200).json({ status: "ok", msg: "Workflow lanzado 🚀" });
        } else {
            const err = await resp.json();
            res.status(400).json({ status: "error", err });
        }
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
}