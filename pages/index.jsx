import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [form, setForm] = useState({
    prenom: "", nom: "", job: "", email: "", phone: "",
    city: "", linkedin: "", portfolio: "", degree: "",
    school: "", years: "", experience: "", skills: "",
    mention: "", l1: "Français", l1n: "Natif", l2: "Anglais", l2n: "B2"
  });
  const [offer, setOffer] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profil");
  const [previewTab, setPreviewTab] = useState("cv");
  const [photo, setPhoto] = useState(null);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const optimizeWithAI = async () => {
    if (!offer.trim()) {
      alert("Colle d'abord une offre d'emploi !");
      return;
    }
    setLoading(true);
    setProgress(0);

    const steps = [
      { p: 20, t: "🔍 Analyse de l'offre..." },
      { p: 40, t: "🏷️ Extraction des mots-clés ATS..." },
      { p: 60, t: "✍️ Reformulation des expériences..." },
      { p: 80, t: "📊 Calcul du score ATS..." },
      { p: 95, t: "📝 Génération de la lettre..." },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i].p);
        setProgressText(steps[i].t);
        i++;
      }
    }, 800);

    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, offer }),
      });
      const data = await res.json();
      clearInterval(interval);
      setProgress(100);
      setProgressText("✅ CV optimisé — Score ATS : " + data.score_ats + "/100 !");
      setResult(data);
      setPreviewTab("cv");
      setTimeout(() => { setProgress(0); setProgressText(""); }, 5000);
    } catch (err) {
      clearInterval(interval);
      setProgressText("❌ Erreur — réessaie");
      setProgress(0);
    }
    setLoading(false);
  };

  const fullName = [form.prenom, form.nom].filter(Boolean).join(" ") || "Prénom Nom";
  const skills = result?.competences || (form.skills ? form.skills.split(",").map(s => s.trim()).filter(Boolean) : ["Maintenance industrielle", "Lean/5S", "GMAO", "Logistique", "AutoCAD", "Excel avancé"]);

  return (
    <>
      <Head>
        <title>CVcraft — Le CV qui décroche l'entretien</title>
        <meta name="description" content="Créez un CV professionnel optimisé par IA en 2 minutes" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:wght@700;900&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #08080a; color: #fff; }
        nav { position: fixed; top: 16px; left: 50%; transform: translateX(-50%); z-index: 999; width: calc(100% - 48px); max-width: 1200px; display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; border-radius: 44px; background: rgba(8,8,10,.92); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,.08); }
        .logo { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 900; color: #fff; text-decoration: none; }
        .logo span { color: #2563eb; }
        .nav-cta { background: #2563eb; color: #fff; padding: 10px 22px; border-radius: 999px; font-size: 14px; font-weight: 700; text-decoration: none; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
        .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px 24px 60px; text-align: center; background: #08080a; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; top: -30%; left: -10%; width: 70%; height: 70%; border-radius: 50%; background: radial-gradient(ellipse, rgba(29,78,216,.18) 0%, transparent 65%); }
        .hero::after { content: ''; position: absolute; bottom: -20%; right: -10%; width: 60%; height: 60%; border-radius: 50%; background: radial-gradient(ellipse, rgba(124,58,237,.12) 0%, transparent 65%); }
        .hero-inner { position: relative; z-index: 1; max-width: 860px; }
        .pill { display: inline-flex; align-items: center; gap: 8px; padding: 7px 16px; border-radius: 999px; margin-bottom: 32px; border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.04); font-size: 13px; font-weight: 600; color: rgba(255,255,255,.55); }
        .pill-dot { width: 6px; height: 6px; border-radius: 50%; background: #2563eb; animation: blink 2s infinite; }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:.3} }
        h1 { font-family: 'Fraunces', serif; font-size: clamp(52px, 9vw, 96px); font-weight: 900; line-height: .92; letter-spacing: -3px; margin-bottom: 28px; }
        .gradient-text { background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .outline-text { color: transparent; -webkit-text-stroke: 1.5px rgba(255,255,255,.2); }
        .hero-sub { font-size: clamp(16px, 2vw, 20px); color: rgba(255,255,255,.45); max-width: 520px; margin: 0 auto 40px; line-height: 1.65; }
        .ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .cta-p { background: #2563eb; color: #fff; padding: 16px 36px; border-radius: 999px; font-size: 16px; font-weight: 700; text-decoration: none; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all .25s; box-shadow: 0 4px 20px rgba(37,99,235,.3); }
        .cta-p:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(37,99,235,.5); }
        .cta-s { background: transparent; color: rgba(255,255,255,.6); padding: 16px 32px; border-radius: 999px; font-size: 16px; font-weight: 600; text-decoration: none; border: 1px solid rgba(255,255,255,.12); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
        .trust { font-size: 13px; color: rgba(255,255,255,.25); margin-top: 20px; }
        section { padding: 100px 24px; }
        .ct { max-width: 1100px; margin: 0 auto; }
        .eyebrow { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .14em; color: #2563eb; margin-bottom: 14px; }
        .sec-h { font-family: 'Fraunces', serif; font-size: clamp(32px, 4.5vw, 52px); font-weight: 900; letter-spacing: -1.5px; line-height: 1.05; margin-bottom: 18px; }
        .sec-sub { font-size: 18px; color: rgba(255,255,255,.4); max-width: 500px; }
        /* EDITOR */
        .editor { background: #141418; border-radius: 30px; border: 1px solid rgba(255,255,255,.07); overflow: hidden; margin-top: 64px; }
        .editor-bar { background: rgba(255,255,255,.03); padding: 16px 28px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid rgba(255,255,255,.06); flex-wrap: wrap; }
        .e-dots { display: flex; gap: 7px; }
        .e-dot { width: 13px; height: 13px; border-radius: 50%; }
        .editor-tabs { display: flex; gap: 3px; background: rgba(255,255,255,.05); padding: 4px; border-radius: 8px; margin-left: auto; }
        .etab { padding: 8px 20px; font-size: 13px; font-weight: 600; color: rgba(255,255,255,.35); border: none; background: transparent; border-radius: 6px; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all .2s; }
        .etab.active { background: #2563eb; color: #fff; }
        .editor-body { display: grid; grid-template-columns: 400px 1fr; }
        .form-panel { padding: 32px; overflow-y: auto; max-height: 900px; border-right: 1px solid rgba(255,255,255,.05); }
        .fsec { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: rgba(255,255,255,.2); margin: 24px 0 14px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,.05); }
        .fsec.first { margin-top: 0; padding-top: 0; border-top: none; }
        .fgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .fg { margin-bottom: 10px; }
        .fl { display: block; font-size: 11px; font-weight: 600; color: rgba(255,255,255,.25); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 5px; }
        .fi, .fta { width: 100%; padding: 11px 14px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.07); border-radius: 8px; font-size: 14px; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; }
        .fi::placeholder, .fta::placeholder { color: rgba(255,255,255,.18); }
        .fi:focus, .fta:focus { outline: none; border-color: rgba(37,99,235,.6); background: rgba(37,99,235,.08); }
        .fta { resize: vertical; min-height: 80px; line-height: 1.5; }
        .photo-zone { border: 2px dashed rgba(255,255,255,.1); border-radius: 14px; padding: 20px; text-align: center; cursor: pointer; position: relative; overflow: hidden; }
        .photo-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        .preview-photo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #2563eb; margin: 0 auto 8px; display: block; }
        .ai-btn { width: 100%; padding: 15px; border: none; border-radius: 14px; cursor: pointer; font-size: 15px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; background: linear-gradient(135deg, #2563eb, #7c3aed); color: #fff; margin-top: 16px; transition: all .2s; }
        .ai-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(37,99,235,.4); }
        .ai-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }
        .prog-track { height: 3px; background: rgba(255,255,255,.07); border-radius: 3px; overflow: hidden; margin-top: 12px; }
        .prog-bar { height: 100%; background: linear-gradient(90deg, #2563eb, #7c3aed); border-radius: 3px; transition: width .3s; }
        .prog-text { font-size: 12px; color: rgba(255,255,255,.3); margin-top: 7px; min-height: 18px; }
        /* PREVIEW */
        .preview-panel { background: #f8f7f3; overflow-y: auto; max-height: 900px; }
        .preview-inner { padding: 28px; }
        .ptabs { display: flex; gap: 6px; margin-bottom: 20px; }
        .ptab { flex: 1; padding: 10px; font-size: 13px; font-weight: 700; border-radius: 8px; border: 1.5px solid #e8e7e1; background: #fff; color: #74736c; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all .2s; }
        .ptab.active { background: #08080a; color: #fff; border-color: #08080a; }
        /* CV DOC */
        .cv-doc { background: #fff; border-radius: 14px; box-shadow: 0 4px 32px rgba(0,0,0,.12); overflow: hidden; }
        .cv-grid { display: grid; grid-template-columns: 190px 1fr; }
        .cv-sb { background: #08080a; padding: 28px 20px; }
        .cv-main { padding: 28px 24px; }
        .cv-photo-wrap { text-align: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,.07); }
        .cv-photo { width: 88px; height: 88px; border-radius: 50%; object-fit: cover; border: 3px solid rgba(255,255,255,.2); display: block; margin: 0 auto; }
        .cv-photo-ph { width: 88px; height: 88px; border-radius: 50%; background: rgba(255,255,255,.08); border: 2px dashed rgba(255,255,255,.2); margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 30px; }
        .cv-name { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 900; text-align: center; color: #fff; line-height: 1.15; }
        .cv-role { font-size: 10px; color: rgba(255,255,255,.4); text-align: center; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; margin-top: 4px; }
        .cv-sb-sec { margin-top: 18px; }
        .cv-sb-sec-t { font-size: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: .12em; color: rgba(255,255,255,.25); margin-bottom: 8px; padding-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,.06); }
        .cv-contact { display: flex; align-items: flex-start; gap: 7px; font-size: 11px; color: rgba(255,255,255,.55); margin-bottom: 7px; word-break: break-all; }
        .cv-link-item { font-size: 11px; color: rgba(99,155,250,.8); margin-bottom: 6px; }
        .cv-skill-i { margin-bottom: 8px; }
        .cv-skill-n { font-size: 11px; color: rgba(255,255,255,.6); margin-bottom: 3px; }
        .cv-skill-t { height: 3px; background: rgba(255,255,255,.08); border-radius: 2px; }
        .cv-skill-f { height: 100%; border-radius: 2px; background: linear-gradient(90deg, #2563eb, #818cf8); }
        .cv-lang { display: flex; justify-content: space-between; font-size: 11px; color: rgba(255,255,255,.55); margin-bottom: 5px; }
        .cv-lang-lvl { font-size: 10px; color: rgba(255,255,255,.25); background: rgba(255,255,255,.05); padding: 1px 7px; border-radius: 999px; }
        .cv-main-sec { margin-bottom: 20px; }
        .cv-main-sec-t { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .13em; color: #2563eb; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid #eff6ff; }
        .cv-entry { margin-bottom: 12px; }
        .cv-entry-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 3px; }
        .cv-entry-title { font-size: 13px; font-weight: 700; color: #08080a; }
        .cv-entry-date { font-size: 10px; color: #74736c; background: #f2f1ed; padding: 2px 8px; border-radius: 999px; white-space: nowrap; }
        .cv-entry-co { font-size: 12px; color: #74736c; font-style: italic; margin-bottom: 5px; }
        .cv-entry-desc { font-size: 12px; color: #4a4944; line-height: 1.7; }
        .cv-entry-desc ul { padding-left: 16px; }
        .cv-entry-desc li { margin-bottom: 2px; }
        .cv-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
        .cvtag { font-size: 10px; padding: 3px 10px; border-radius: 999px; font-weight: 700; }
        .cvtag.b { background: #eff6ff; color: #1d4ed8; }
        .cvtag.g { background: #f0fdf4; color: #15803d; }
        .cvtag.p { background: #f5f3ff; color: #7c3aed; }
        .cvtag.gy { background: #f2f1ed; color: #4a4944; }
        .dl-row { display: flex; gap: 10px; padding: 0 28px 28px; }
        .dl-btn { flex: 1; padding: 13px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; border: none; font-family: 'Plus Jakarta Sans', sans-serif; }
        .dl-p { background: #08080a; color: #fff; }
        .dl-p:hover { background: #2563eb; }
        .dl-s { background: #f2f1ed; color: #08080a; }
        /* LM */
        .lm-doc { background: #fff; border-radius: 14px; padding: 36px; font-size: 14px; line-height: 1.9; color: #4a4944; }
        .lm-doc p { margin-bottom: 14px; }
        .lm-name { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 900; color: #08080a; }
        .lm-role { color: #2563eb; font-weight: 700; font-size: 13px; margin: 4px 0 24px; text-transform: uppercase; letter-spacing: .06em; }
        /* PRICING */
        .pricing-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-top: 64px; }
        .pc { border: 1px solid rgba(255,255,255,.07); border-radius: 30px; padding: 36px 28px; background: #141418; }
        .pc.feat { background: #fff; color: #08080a; border: 2px solid #2563eb; transform: scale(1.03); }
        .pc-badge { display: inline-block; font-size: 11px; font-weight: 700; padding: 5px 14px; border-radius: 999px; margin-bottom: 20px; }
        .pc:not(.feat) .pc-badge { background: rgba(37,99,235,.15); color: #93c5fd; }
        .pc.feat .pc-badge { background: #2563eb; color: #fff; }
        .pc-name { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 900; margin-bottom: 8px; }
        .pc.feat .pc-name { color: #08080a; }
        .pc-price { font-family: 'Fraunces', serif; font-size: 52px; font-weight: 900; line-height: 1; letter-spacing: -2px; }
        .pc.feat .pc-price { color: #08080a; }
        .pc-price sup { font-size: 22px; vertical-align: top; margin-top: 10px; display: inline-block; }
        .pc-price sub { font-size: 16px; font-weight: 400; opacity: .5; }
        .pc-desc { font-size: 14px; color: rgba(255,255,255,.35); margin: 12px 0 24px; }
        .pc.feat .pc-desc { color: #74736c; }
        .pc-feats { list-style: none; margin-bottom: 28px; }
        .pc-feats li { font-size: 14px; padding: 8px 0; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,255,255,.05); }
        .pc.feat .pc-feats li { border-color: #e8e7e1; }
        .pc-feats li.no { opacity: .4; }
        .chk { width: 20px; height: 20px; border-radius: 50%; background: #15803d; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #fff; flex-shrink: 0; }
        .crx { width: 20px; height: 20px; border-radius: 50%; background: rgba(255,255,255,.05); display: flex; align-items: center; justify-content: center; font-size: 10px; color: rgba(255,255,255,.2); flex-shrink: 0; }
        .pc.feat .crx { background: #f2f1ed; color: #a8a79f; }
        .pc-btn { width: 100%; padding: 16px; border-radius: 999px; font-size: 15px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; border: none; cursor: pointer; }
        .pc:not(.feat) .pc-btn { background: rgba(255,255,255,.06); color: #fff; border: 1px solid rgba(255,255,255,.1); }
        .pc.feat .pc-btn { background: #2563eb; color: #fff; }
        /* FAQ */
        .faq-wrap { max-width: 720px; margin: 64px auto 0; }
        .faq-item { border-bottom: 1px solid rgba(255,255,255,.06); }
        .faq-q { width: 100%; padding: 22px 0; display: flex; justify-content: space-between; align-items: center; background: none; border: none; cursor: pointer; font-size: 17px; font-weight: 600; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; text-align: left; gap: 16px; }
        .faq-icon { width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,.05); display: flex; align-items: center; justify-content: center; font-size: 18px; color: rgba(255,255,255,.3); flex-shrink: 0; transition: all .3s; }
        .faq-item.open .faq-icon { background: #2563eb; color: #fff; transform: rotate(45deg); }
        .faq-a { max-height: 0; overflow: hidden; transition: max-height .4s; }
        .faq-a-in { font-size: 16px; color: rgba(255,255,255,.4); line-height: 1.8; padding-bottom: 22px; }
        .cta-bottom { background: #08080a; padding: 120px 24px; text-align: center; border-top: 1px solid rgba(255,255,255,.05); }
        .cta-h { font-family: 'Fraunces', serif; font-size: clamp(40px, 7vw, 72px); font-weight: 900; letter-spacing: -2px; line-height: .95; margin-bottom: 20px; }
        .cta-h em { font-style: normal; background: linear-gradient(135deg, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .cta-sub { font-size: 18px; color: rgba(255,255,255,.35); margin-bottom: 40px; }
        .cta-note { font-size: 13px; color: rgba(255,255,255,.2); margin-top: 16px; }
        footer { background: #141418; border-top: 1px solid rgba(255,255,255,.05); padding: 36px 24px; }
        .footer-in { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .footer-logo { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 900; color: rgba(255,255,255,.3); }
        .footer-copy { font-size: 13px; color: rgba(255,255,255,.15); }
        .score-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(21,128,61,.15); border: 1px solid rgba(21,128,61,.3); color: #86efac; padding: 8px 16px; border-radius: 999px; font-size: 14px; font-weight: 700; margin-top: 12px; }
      `}</style>

      {/* NAV */}
      <nav>
        <a className="logo" href="#">CV<span>craft</span></a>
        <a className="nav-cta" href="#app">Créer mon CV →</a>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-inner">
          <div className="pill"><span className="pill-dot"></span>IA réelle · Score ATS instantané · 100% gratuit pour commencer</div>
          <h1>
            <span style={{display:'block'}}>Ton CV qui</span>
            <span className="gradient-text" style={{display:'block'}}>décroche</span>
            <span className="outline-text" style={{display:'block'}}>l'entretien.</span>
          </h1>
          <p className="hero-sub">CVcraft analyse l'offre, reformule ton profil, génère ta lettre. Un CV sur mesure en 2 minutes.</p>
          <div className="ctas">
            <a className="cta-p" href="#app">Créer mon CV gratuitement</a>
            <a className="cta-s" href="#how">Voir comment ça marche</a>
          </div>
          <p className="trust">✓ Gratuit pour commencer · ✓ Aucune carte bancaire · ✓ Données 100% privées</p>
        </div>
      </div>

      {/* HOW */}
      <section id="how" style={{background:'#141418'}}>
        <div className="ct">
          <div className="eyebrow">Comment ça marche</div>
          <h2 className="sec-h">Trois étapes.<br/>Un CV parfait.</h2>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2px', marginTop:'64px', background:'rgba(255,255,255,.05)', borderRadius:'30px', overflow:'hidden'}}>
            {[
              {n:'01', ico:'✏️', h:'Remplis ton profil', p:'Infos perso, photo, LinkedIn, portfolio, formation, expériences. Guidé pas à pas.'},
              {n:'02', ico:'🤖', h:"L'IA optimise tout", p:"Colle l'offre. L'IA extrait les mots-clés, reformule, calcule ton score ATS et génère ta lettre."},
              {n:'03', ico:'🚀', h:'Télécharge et postule', p:'CV + lettre en PDF haute qualité. Prêt à envoyer aux recruteurs.'},
            ].map((s,i) => (
              <div key={i} style={{background:'#141418', padding:'48px 40px'}}>
                <div style={{fontFamily:'Fraunces, serif', fontSize:'64px', fontWeight:'900', color:'rgba(255,255,255,.04)', lineHeight:'1', marginBottom:'20px'}}>{s.n}</div>
                <div style={{fontSize:'32px', marginBottom:'16px'}}>{s.ico}</div>
                <div style={{fontFamily:'Fraunces, serif', fontSize:'22px', fontWeight:'700', color:'#fff', marginBottom:'10px'}}>{s.h}</div>
                <p style={{fontSize:'15px', color:'rgba(255,255,255,.4)', lineHeight:'1.7'}}>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDITOR */}
      <section id="app">
        <div className="ct">
          <div className="eyebrow">L'éditeur intelligent</div>
          <h2 className="sec-h">Crée ton CV.<br/>Tout en temps réel.</h2>
          <div className="editor">
            <div className="editor-bar">
              <div className="e-dots">
                <div className="e-dot" style={{background:'#ff5f57'}}></div>
                <div className="e-dot" style={{background:'#febc2e'}}></div>
                <div className="e-dot" style={{background:'#28c840'}}></div>
              </div>
              <span style={{fontSize:'13px', color:'rgba(255,255,255,.25)'}}>CVcraft — Éditeur</span>
              <div className="editor-tabs">
                <button className={`etab ${activeTab==='profil'?'active':''}`} onClick={()=>setActiveTab('profil')}>Mon profil</button>
                <button className={`etab ${activeTab==='ia'?'active':''}`} onClick={()=>setActiveTab('ia')}>Optimisation IA</button>
              </div>
            </div>
            <div className="editor-body">
              {/* FORM */}
              <div className="form-panel">
                {activeTab === 'profil' && (
                  <div>
                    <div className="fsec first">Photo de profil</div>
                    <div className="photo-zone">
                      <input type="file" accept="image/*" onChange={handlePhoto} />
                      {photo ? <img src={photo} alt="photo" className="preview-photo" /> : <div style={{textAlign:'center'}}><div style={{fontSize:'28px', marginBottom:'8px'}}>📷</div><div style={{fontSize:'13px', color:'rgba(255,255,255,.35)'}}><strong style={{color:'rgba(255,255,255,.65)'}}>Clique pour ajouter ta photo</strong><br/>JPG, PNG · Max 5MB</div></div>}
                    </div>
                    <div className="fsec">Informations personnelles</div>
                    <div className="fgrid">
                      <div className="fg"><label className="fl">Prénom</label><input className="fi" placeholder="Thomas" value={form.prenom} onChange={e=>update('prenom',e.target.value)} /></div>
                      <div className="fg"><label className="fl">Nom</label><input className="fi" placeholder="Martin" value={form.nom} onChange={e=>update('nom',e.target.value)} /></div>
                    </div>
                    <div className="fg"><label className="fl">Poste visé</label><input className="fi" placeholder="Technicien de Maintenance" value={form.job} onChange={e=>update('job',e.target.value)} /></div>
                    <div className="fg"><label className="fl">Email</label><input className="fi" placeholder="thomas@email.com" value={form.email} onChange={e=>update('email',e.target.value)} /></div>
                    <div className="fgrid">
                      <div className="fg"><label className="fl">Téléphone</label><input className="fi" placeholder="06 12 34 56 78" value={form.phone} onChange={e=>update('phone',e.target.value)} /></div>
                      <div className="fg"><label className="fl">Ville</label><input className="fi" placeholder="Mantes-la-Jolie" value={form.city} onChange={e=>update('city',e.target.value)} /></div>
                    </div>
                    <div className="fg"><label className="fl">💼 LinkedIn</label><input className="fi" placeholder="linkedin.com/in/prenom-nom" value={form.linkedin} onChange={e=>update('linkedin',e.target.value)} /></div>
                    <div className="fg"><label className="fl">🌐 Portfolio/GitHub</label><input className="fi" placeholder="github.com/prenom-nom" value={form.portfolio} onChange={e=>update('portfolio',e.target.value)} /></div>
                    <div className="fsec">Formation</div>
                    <div className="fg"><label className="fl">Diplôme</label><input className="fi" placeholder="BUT Génie Industriel" value={form.degree} onChange={e=>update('degree',e.target.value)} /></div>
                    <div className="fg"><label className="fl">École</label><input className="fi" placeholder="IUT de Mantes / Paris-Saclay" value={form.school} onChange={e=>update('school',e.target.value)} /></div>
                    <div className="fgrid">
                      <div className="fg"><label className="fl">Période</label><input className="fi" placeholder="2023 – 2026" value={form.years} onChange={e=>update('years',e.target.value)} /></div>
                      <div className="fg"><label className="fl">Mention</label><input className="fi" placeholder="Bien" value={form.mention} onChange={e=>update('mention',e.target.value)} /></div>
                    </div>
                    <div className="fsec">Expérience</div>
                    <div className="fg"><label className="fl">Poste</label><input className="fi" placeholder="Opérateur logistique" value={form.experience?.split('|')[0]||''} onChange={e=>update('experience',e.target.value)} /></div>
                    <div className="fg"><label className="fl">Missions (une par ligne)</label><textarea className="fta" placeholder="Gestion des flux&#10;Optimisation des stocks" value={form.experience} onChange={e=>update('experience',e.target.value)} /></div>
                    <div className="fsec">Compétences (séparées par virgules)</div>
                    <div className="fg"><textarea className="fta" style={{minHeight:'60px'}} placeholder="Maintenance, Lean/5S, GMAO, AutoCAD..." value={form.skills} onChange={e=>update('skills',e.target.value)} /></div>
                    <div className="fsec">Langues</div>
                    <div className="fgrid">
                      <div className="fg"><label className="fl">Langue 1</label><input className="fi" value={form.l1} onChange={e=>update('l1',e.target.value)} /></div>
                      <div className="fg"><label className="fl">Niveau</label><input className="fi" value={form.l1n} onChange={e=>update('l1n',e.target.value)} /></div>
                    </div>
                    <div className="fgrid">
                      <div className="fg"><label className="fl">Langue 2</label><input className="fi" value={form.l2} onChange={e=>update('l2',e.target.value)} /></div>
                      <div className="fg"><label className="fl">Niveau</label><input className="fi" value={form.l2n} onChange={e=>update('l2n',e.target.value)} /></div>
                    </div>
                  </div>
                )}
                {activeTab === 'ia' && (
                  <div>
                    <div className="fsec first">Offre d'emploi</div>
                    <div className="fg"><label className="fl">Colle le texte de l'offre ici</label><textarea className="fta" style={{minHeight:'200px'}} placeholder="Colle ici le texte complet de l'offre d'emploi. La vraie IA va analyser et optimiser ton CV..." value={offer} onChange={e=>setOffer(e.target.value)} /></div>
                    <button className="ai-btn" onClick={optimizeWithAI} disabled={loading}>
                      {loading ? "⏳ Optimisation en cours..." : "⚡ Optimiser mon CV avec l'IA"}
                    </button>
                    <div className="prog-track"><div className="prog-bar" style={{width:progress+'%'}}></div></div>
                    <div className="prog-text">{progressText}</div>
                    {result && (
                      <div className="score-badge">🎯 Score ATS : {result.score_ats}/100 · Mots-clés : {result.mots_cles?.slice(0,3).join(', ')}</div>
                    )}
                    <div style={{marginTop:'20px', padding:'20px', background:'rgba(37,99,235,.06)', borderRadius:'14px', border:'1px solid rgba(37,99,235,.15)'}}>
                      <p style={{fontSize:'13px', color:'#818cf8', fontWeight:'700', marginBottom:'10px'}}>✦ Ce que fait la vraie IA :</p>
                      <div style={{fontSize:'13px', color:'rgba(255,255,255,.4)', lineHeight:'2.3'}}>
                        <div>🔍 Analyse sémantique de l'offre</div>
                        <div>🏷️ Extraction des mots-clés ATS</div>
                        <div>✍️ Reformulation de tes expériences</div>
                        <div>📊 Score ATS calculé par Claude</div>
                        <div>📝 Lettre de motivation personnalisée</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* PREVIEW */}
              <div className="preview-panel">
                <div className="preview-inner">
                  <div className="ptabs">
                    <button className={`ptab ${previewTab==='cv'?'active':''}`} onClick={()=>setPreviewTab('cv')}>📄 CV</button>
                    <button className={`ptab ${previewTab==='lm'?'active':''}`} onClick={()=>setPreviewTab('lm')}>✉️ Lettre</button>
                  </div>

                  {previewTab === 'cv' && (
                    <>
                      <div className="cv-doc">
                        <div className="cv-grid">
                          <div className="cv-sb">
                            <div className="cv-photo-wrap">
                              {photo ? <img src={photo} alt="" className="cv-photo" /> : <div className="cv-photo-ph">👤</div>}
                              <div className="cv-name" style={{marginTop:'12px'}}>{fullName}</div>
                              <div className="cv-role">{form.job || 'Poste visé'}</div>
                            </div>
                            <div className="cv-sb-sec">
                              <div className="cv-sb-sec-t">Contact</div>
                              <div className="cv-contact">📧 {form.email || 'email@exemple.com'}</div>
                              <div className="cv-contact">📞 {form.phone || '06 XX XX XX XX'}</div>
                              <div className="cv-contact">📍 {form.city || 'Ville'}</div>
                              {form.linkedin && <div className="cv-link-item">💼 {form.linkedin}</div>}
                              {form.portfolio && <div className="cv-link-item">🌐 {form.portfolio}</div>}
                            </div>
                            <div className="cv-sb-sec">
                              <div className="cv-sb-sec-t">Compétences</div>
                              {skills.slice(0,5).map((s,i) => (
                                <div key={i} className="cv-skill-i">
                                  <div className="cv-skill-n">{s}</div>
                                  <div className="cv-skill-t"><div className="cv-skill-f" style={{width:(95-i*5)+'%'}}></div></div>
                                </div>
                              ))}
                            </div>
                            <div className="cv-sb-sec">
                              <div className="cv-sb-sec-t">Langues</div>
                              <div className="cv-lang"><span>{form.l1}</span><span className="cv-lang-lvl">{form.l1n}</span></div>
                              <div className="cv-lang"><span>{form.l2}</span><span className="cv-lang-lvl">{form.l2n}</span></div>
                            </div>
                          </div>
                          <div className="cv-main">
                            <div className="cv-main-sec">
                              <div className="cv-main-sec-t">Formation</div>
                              <div className="cv-entry">
                                <div className="cv-entry-row">
                                  <div className="cv-entry-title">{form.degree || 'BUT Génie Industriel et Maintenance'}</div>
                                  <div className="cv-entry-date">{form.years || '2023 – 2026'}</div>
                                </div>
                                <div className="cv-entry-co">{form.school || 'IUT de Mantes · Université Paris-Saclay'}</div>
                                <div className="cv-tags">
                                  <span className="cvtag b">Maintenance</span>
                                  <span className="cvtag g">Génie industriel</span>
                                  {form.mention && <span className="cvtag gy">Mention {form.mention}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="cv-main-sec">
                              <div className="cv-main-sec-t">Expérience professionnelle</div>
                              <div className="cv-entry">
                                <div className="cv-entry-row">
                                  <div className="cv-entry-title">Opérateur logistique</div>
                                  <div className="cv-entry-date">2024 – Présent</div>
                                </div>
                                <div className="cv-entry-co">Lidl — Grand entrepôt logistique</div>
                                <div className="cv-entry-desc">
                                  {result?.experience_optimisee ? (
                                    <ul>{result.experience_optimisee.split('\n').filter(Boolean).map((l,i)=><li key={i}>{l.replace(/^[-•*]\s*/,'')}</li>)}</ul>
                                  ) : (
                                    <ul>
                                      <li>Gestion des flux de marchandises et optimisation des stocks</li>
                                      <li>Respect des procédures qualité en environnement haute cadence</li>
                                      <li>Contribution à la réduction des erreurs de préparation</li>
                                    </ul>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="cv-main-sec">
                              <div className="cv-main-sec-t">Compétences techniques</div>
                              <div className="cv-tags">
                                {skills.map((s,i) => (
                                  <span key={i} className={`cvtag ${['b','g','p','b','g','gy','b','g'][i%8]}`}>{s}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="dl-row">
                        <button className="dl-btn dl-p">⬇️ Télécharger PDF</button>
                        <button className="dl-btn dl-s">🔗 Partager</button>
                      </div>
                    </>
                  )}

                  {previewTab === 'lm' && (
                    <>
                      <div className="lm-doc">
                        <div className="lm-name">{fullName}</div>
                        <div className="lm-role">Candidature — {form.job || 'Poste visé'}</div>
                        <p>Madame, Monsieur,</p>
                        <p>{result?.lettre || `Actuellement en ${form.degree || 'BUT Génie Industriel'} à ${form.school || "l'IUT de Mantes"}, je vous adresse ma candidature avec enthousiasme pour le poste de ${form.job || 'technicien'} proposé au sein de votre organisation.`}</p>
                        {!result && <p>Mon expérience en environnement logistique m'a permis de développer une rigueur opérationnelle et une compréhension concrète des flux industriels, compétences directement applicables à votre poste.</p>}
                        <p>Dans l'attente de vous rencontrer, je reste disponible pour tout entretien à votre convenance.</p>
                        <p>Cordialement,<br/><strong>{fullName}</strong></p>
                      </div>
                      <div className="dl-row">
                        <button className="dl-btn dl-p">⬇️ Télécharger PDF</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{background:'#141418'}}>
        <div className="ct">
          <div className="eyebrow">Tarifs</div>
          <h2 className="sec-h">Simple et transparent.</h2>
          <div className="pricing-grid">
            {[
              {badge:'Gratuit', name:'Starter', price:'0', sub:'', desc:'Pour découvrir et créer un premier CV.', feat:[['1 CV basique',true],['1 template',true],['Export PDF',true],['Optimisation IA',false],['Photo & liens',false],['Lettre de motivation',false]], btn:'Commencer gratuitement', feat_cls:''},
              {badge:'⭐ Populaire', name:'Pro', price:'4', sub:',99 / CV', desc:"Pour décrocher l'entretien que tu mérites.", feat:[['CV optimisé par IA',true],['Photo + LinkedIn + Portfolio',true],['Lettre de motivation IA',true],['Score ATS détaillé',true],['5 templates premium',true],['PDF haute qualité',true]], btn:'Obtenir mon CV Pro', feat_cls:'feat'},
              {badge:'Meilleure valeur', name:'Illimité', price:'9', sub:',99 / mois', desc:'Pour postuler en série sans se ruiner.', feat:[['CV + LM illimités',true],['Tous les templates',true],['Suivi des candidatures',true],['Nouvelles fonctionnalités en avant-première',true],['Support prioritaire',true],['Annulation à tout moment',true]], btn:"S'abonner", feat_cls:''},
            ].map((p,i) => (
              <div key={i} className={`pc ${p.feat_cls}`}>
                <div className="pc-badge">{p.badge}</div>
                <div className="pc-name">{p.name}</div>
                <div className="pc-price"><sup>€</sup>{p.price}<sub>{p.sub}</sub></div>
                <div className="pc-desc">{p.desc}</div>
                <ul className="pc-feats">
                  {p.feat.map(([label,ok],j) => (
                    <li key={j} className={ok?'':' no'}>
                      {ok ? <span className="chk">✓</span> : <span className="crx">✗</span>}
                      {label}
                    </li>
                  ))}
                </ul>
                <button className="pc-btn">{p.btn}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="ct" style={{textAlign:'center'}}>
          <div className="eyebrow">FAQ</div>
          <h2 className="sec-h">Questions fréquentes</h2>
        </div>
        <div className="faq-wrap">
          {[
            ["C'est vraiment gratuit pour commencer ?", "Oui, totalement. Tu crées un CV basique sans carte bancaire. L'optimisation IA, photo, liens et lettre sont en version Pro à 4,99€ par CV ou 9,99€/mois illimité."],
            ["L'IA est vraiment réelle ?", "Oui ! CVcraft utilise Claude d'Anthropic — la même IA que tu utilises ici. Quand tu cliques 'Optimiser', c'est une vraie requête IA qui analyse ton profil et l'offre d'emploi."],
            ["Qu'est-ce qu'un score ATS ?", "Les ATS sont des logiciels utilisés par la majorité des entreprises pour filtrer les CV automatiquement. CVcraft optimise ton CV pour passer ces filtres en intégrant les bons mots-clés."],
            ["Mes données sont-elles sécurisées ?", "Tes données ne sont jamais vendues ni partagées. Tout est chiffré et conforme au RGPD. Tu supprimes ton compte à tout moment."],
            ["Puis-je annuler l'abonnement ?", "Oui, sans engagement. Tu annules en un clic depuis ton espace. Tu gardes l'accès jusqu'à la fin de la période payée."],
          ].map(([q,a],i) => (
            <div key={i} className="faq-item" onClick={e=>{const item=e.currentTarget;item.classList.toggle('open');const ans=item.querySelector('.faq-a');ans.style.maxHeight=item.classList.contains('open')?ans.scrollHeight+'px':'0';}}>
              <button className="faq-q">{q}<span className="faq-icon">+</span></button>
              <div className="faq-a"><div className="faq-a-in">{a}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="cta-bottom">
        <h2 className="cta-h">Ton prochain entretien<br/>commence <em>ici.</em></h2>
        <p className="cta-sub">Aucune carte bancaire requise. Gratuit pour démarrer.</p>
        <a className="cta-p" href="#app">Créer mon CV gratuitement →</a>
        <p className="cta-note">✓ Gratuit · ✓ Données privées · ✓ Annulation à tout moment</p>
      </div>

      <footer>
        <div className="footer-in">
          <div className="footer-logo">CVcraft</div>
          <div className="footer-copy">© 2026 CVcraft · Fait avec ❤️ en France · Propulsé par Claude AI</div>
        </div>
      </footer>
    </>
  );
}
