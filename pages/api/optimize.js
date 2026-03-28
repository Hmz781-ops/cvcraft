import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { nom, prenom, job, email, phone, city, linkedin, 
          portfolio, degree, school, years, experience, 
          skills, offer } = req.body;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Tu es un expert en recrutement et rédaction de CV professionnels.
          
Voici le profil du candidat :
- Nom : ${prenom} ${nom}
- Poste visé : ${job}
- Formation : ${degree} à ${school} (${years})
- Expérience : ${experience}
- Compétences actuelles : ${skills}

Offre d'emploi ciblée :
${offer}

Génère en JSON uniquement (sans markdown) :
{
  "experience_optimisee": "description reformulée en 3-4 bullet points percutants",
  "competences": ["compétence1", "compétence2", "compétence3", "compétence4", "compétence5", "compétence6", "compétence7", "compétence8"],
  "lettre": "lettre de motivation complète personnalisée",
  "score_ats": 94,
  "mots_cles": ["mot1", "mot2", "mot3", "mot4", "mot5"]
}`
        }
      ]
    });

    const content = message.content[0].text;
    const data = JSON.parse(content);
    res.status(200).json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur IA" });
  }
}
