const state = {
  animal: "",
  negotiation: "",
  pressure: "",
  startedAt: Date.now()
};

const refs = {
  candidateName: document.getElementById("candidateName"),
  recruiterName: document.getElementById("recruiterName"),
  jobProfile: document.getElementById("jobProfile"),
  preDecision: document.getElementById("preDecision"),
  selectedAnimal: document.getElementById("selectedAnimal"),
  scoreClarity: document.getElementById("scoreClarity"),
  scoreConsistency: document.getElementById("scoreConsistency"),
  scoreMaturity: document.getElementById("scoreMaturity"),
  scoreFit: document.getElementById("scoreFit"),
  scoreClarityValue: document.getElementById("scoreClarityValue"),
  scoreConsistencyValue: document.getElementById("scoreConsistencyValue"),
  scoreMaturityValue: document.getElementById("scoreMaturityValue"),
  scoreFitValue: document.getElementById("scoreFitValue"),
  recruiterNotes: document.getElementById("recruiterNotes"),
  mCollaboration: document.getElementById("mCollaboration"),
  mAssertiveness: document.getElementById("mAssertiveness"),
  mPressure: document.getElementById("mPressure"),
  mOrganization: document.getElementById("mOrganization"),
  mAutonomy: document.getElementById("mAutonomy"),
  mRisk: document.getElementById("mRisk"),
  seniority: document.getElementById("seniority"),
  executiveSummary: document.getElementById("executiveSummary"),
  tagsBox: document.getElementById("tagsBox"),
  copySummary: document.getElementById("copySummary"),
  generateBtn: document.getElementById("generateBtn"),
  clearBtn: document.getElementById("clearBtn"),
  copyBtn: document.getElementById("copyBtn"),
  downloadBtn: document.getElementById("downloadBtn")
};

function bindRanges(){
  [
    ["scoreClarity","scoreClarityValue"],
    ["scoreConsistency","scoreConsistencyValue"],
    ["scoreMaturity","scoreMaturityValue"],
    ["scoreFit","scoreFitValue"]
  ].forEach(([rangeId, valueId]) => {
    const range = refs[rangeId];
    const value = refs[valueId];
    range.addEventListener("input", () => value.textContent = range.value);
    value.textContent = range.value;
  });
}

function bindChoices(){
  document.querySelectorAll(".choice-card").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".choice-card").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      state.animal = btn.dataset.animal;
      refs.selectedAnimal.textContent = state.animal;
    });
  });

  document.querySelectorAll(".option-card").forEach(btn => {
    btn.addEventListener("click", () => {
      const group = btn.dataset.group;
      document.querySelectorAll(`.option-card[data-group="${group}"]`).forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      state[group] = btn.dataset.value;
    });
  });
}

function clamp(n){ return Math.max(0, Math.min(100, Math.round(n))); }

function animalBase(animal){
  const map = {
    "Leão": { collaboration: 58, assertiveness: 85, pressure: 72, organization: 60, autonomy: 82 },
    "Cachorro": { collaboration: 84, assertiveness: 66, pressure: 74, organization: 67, autonomy: 58 },
    "Abelha": { collaboration: 76, assertiveness: 62, pressure: 78, organization: 88, autonomy: 69 },
    "Gato": { collaboration: 59, assertiveness: 70, pressure: 68, organization: 74, autonomy: 84 }
  };
  return map[animal] || { collaboration: 60, assertiveness: 60, pressure: 60, organization: 60, autonomy: 60 };
}

function negotiationDelta(answer){
  const map = {
    "Escuto, organizo dados e proponho uma saída": { collaboration: 8, assertiveness: 7, pressure: 4, organization: 8, autonomy: 2, tags: ["escuta ativa","negociação madura","pensamento analítico estruturado","resolução de problemas"] },
    "Defendo meu ponto com firmeza até convencer": { collaboration: -2, assertiveness: 12, pressure: 4, organization: 1, autonomy: 6, tags: ["assertividade","influência","posicionamento forte"] },
    "Evito conflito e aceito a decisão do grupo": { collaboration: 5, assertiveness: -8, pressure: -2, organization: 0, autonomy: -6, tags: ["cooperação","adaptação","postura conciliadora"] },
    "Peço mais contexto antes de me posicionar": { collaboration: 2, assertiveness: 1, pressure: 2, organization: 7, autonomy: 4, tags: ["prudência","análise de contexto","decisão cuidadosa"] }
  };
  return map[answer] || { collaboration: 0, assertiveness: 0, pressure: 0, organization: 0, autonomy: 0, tags: [] };
}

function pressureDelta(answer){
  const map = {
    "Peço priorização, contexto e prazo realista": { collaboration: 5, assertiveness: 5, pressure: 10, organization: 6, autonomy: 4, tags: ["boa resposta à pressão","gestão de prioridades","maturidade profissional"] },
    "Aceito tudo e tento resolver sozinho": { collaboration: 1, assertiveness: -1, pressure: -4, organization: 0, autonomy: 7, tags: ["responsabilidade","esforço individual","assunção de carga"] },
    "Questiono a cobrança de forma direta": { collaboration: -2, assertiveness: 9, pressure: 3, organization: 1, autonomy: 5, tags: ["franqueza","assertividade direta","enfrentamento"] },
    "Fico desconfortável e reduzo o ritmo": { collaboration: 0, assertiveness: -7, pressure: -12, organization: -2, autonomy: -4, tags: ["sensibilidade à pressão","necessita suporte"] }
  };
  return map[answer] || { collaboration: 0, assertiveness: 0, pressure: 0, organization: 0, autonomy: 0, tags: [] };
}

function uniqueTags(arr){
  return [...new Set(arr.filter(Boolean))];
}

function classifySeniority(finalScore){
  if (finalScore >= 80) return "Sênior";
  if (finalScore >= 65) return "Pleno";
  return "Júnior";
}

function riskLabel(value){
  if (value > 40) return `${value} | Alto`;
  if (value >= 20) return `${value} | Médio`;
  return `${value} | Baixo`;
}

function buildExecutiveText(metrics, decision){
  const strengths = [];
  const attention = [];

  if (metrics.collaboration >= 75) strengths.push("perfil colaborativo");
  if (metrics.assertiveness >= 75) strengths.push("boa assertividade");
  if (metrics.pressure >= 75) strengths.push("boa atuação sob pressão");
  if (metrics.organization >= 75) strengths.push("organização consistente");
  if (metrics.autonomy >= 75) strengths.push("boa autonomia");

  if (metrics.collaboration < 60) attention.push("fortalecer integração com o time");
  if (metrics.assertiveness < 60) attention.push("evoluir posicionamento");
  if (metrics.pressure < 60) attention.push("desenvolver resposta à pressão");
  if (metrics.organization < 60) attention.push("reforçar organização de rotina");
  if (metrics.autonomy < 60) attention.push("desenvolver autonomia para decisão");

  const strengthText = strengths.length ? strengths.join(", ") : "perfil ainda em consolidação";
  const attentionText = attention.length ? attention.join("; ") : "sem pontos críticos imediatos";

  return `Candidato com ${strengthText}. Apresenta leitura compatível com o contexto da vaga e demonstra potencial de atuação em ambiente corporativo estruturado. Pontos de atenção sugeridos: ${attentionText}. Recomendação preliminar: ${decision}.`;
}

function generate(){
  const base = animalBase(state.animal);
  const nDelta = negotiationDelta(state.negotiation);
  const pDelta = pressureDelta(state.pressure);

  const clarity = Number(refs.scoreClarity.value);
  const consistency = Number(refs.scoreConsistency.value);
  const maturity = Number(refs.scoreMaturity.value);
  const fit = Number(refs.scoreFit.value);

  const metrics = {
    collaboration: clamp(base.collaboration + nDelta.collaboration + pDelta.collaboration + (maturity - 70) * 0.15),
    assertiveness: clamp(base.assertiveness + nDelta.assertiveness + pDelta.assertiveness + (clarity - 70) * 0.10),
    pressure: clamp(base.pressure + nDelta.pressure + pDelta.pressure + (consistency - 70) * 0.10),
    organization: clamp(base.organization + nDelta.organization + pDelta.organization + (consistency - 70) * 0.08),
    autonomy: clamp(base.autonomy + nDelta.autonomy + pDelta.autonomy + (fit - 70) * 0.08)
  };

  const finalScore = Math.round((metrics.collaboration + metrics.assertiveness + metrics.pressure + metrics.organization + metrics.autonomy + fit) / 6);
  const seniority = classifySeniority(finalScore);
  const risk = clamp(100 - ((metrics.organization * 0.4) + (metrics.autonomy * 0.3) + (metrics.pressure * 0.3)));

  refs.mCollaboration.textContent = metrics.collaboration;
  refs.mAssertiveness.textContent = metrics.assertiveness;
  refs.mPressure.textContent = metrics.pressure;
  refs.mOrganization.textContent = metrics.organization;
  refs.mAutonomy.textContent = metrics.autonomy;
  refs.mRisk.textContent = riskLabel(risk);
  refs.seniority.textContent = `${seniority} | Aderência final ${fit}`;

  const tags = uniqueTags([
    ...nDelta.tags,
    ...pDelta.tags,
    metrics.collaboration >= 75 ? "apoio ao time" : "",
    metrics.organization >= 75 ? "organização de rotina" : "",
    metrics.pressure >= 75 ? "estabilidade sob pressão" : "",
    metrics.assertiveness >= 72 ? "comunicação clara" : "",
    fit >= 75 ? "orientação a resultado" : ""
  ]);

  refs.tagsBox.innerHTML = "";
  tags.forEach(tag => {
    const el = document.createElement("span");
    el.className = "tag";
    el.textContent = tag;
    refs.tagsBox.appendChild(el);
  });

  const execText = buildExecutiveText(metrics, refs.preDecision.value);
  refs.executiveSummary.textContent = execText;

  const elapsed = Math.round((Date.now() - state.startedAt) / 1000);
  const min = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const sec = String(elapsed % 60).padStart(2, "0");

  const summaryText = [
    `Candidato: ${refs.candidateName.value || "-"}`,
    `Recrutador: ${refs.recruiterName.value || "-"}`,
    `Perfil da vaga: ${refs.jobProfile.value || "-"}`,
    `Tempo de sessão: ${min}:${sec}`,
    `Escolha simbólica: ${state.animal || "-"}`,
    `Negociação: ${state.negotiation || "-"}`,
    `Chefia / pressão: ${state.pressure || "-"}`,
    `Colaboração: ${metrics.collaboration}`,
    `Assertividade: ${metrics.assertiveness}`,
    `Estabilidade sob pressão: ${metrics.pressure}`,
    `Organização: ${metrics.organization}`,
    `Autonomia: ${metrics.autonomy}`,
    `Risco operacional: ${riskLabel(risk)}`,
    `Aderência final à vaga: ${fit}`,
    `Senioridade sugerida: ${seniority}`,
    `Decisão preliminar: ${refs.preDecision.value}`,
    `Resumo executivo: ${execText}`,
    `Observações do recrutador: ${refs.recruiterNotes.value || "Sem observações"}`
  ].join("\n");

  refs.copySummary.value = summaryText;
  localStorage.setItem("assessment_sonova_session", JSON.stringify({
    state,
    fields: {
      candidateName: refs.candidateName.value,
      recruiterName: refs.recruiterName.value,
      jobProfile: refs.jobProfile.value,
      preDecision: refs.preDecision.value,
      recruiterNotes: refs.recruiterNotes.value,
      scoreClarity: refs.scoreClarity.value,
      scoreConsistency: refs.scoreConsistency.value,
      scoreMaturity: refs.scoreMaturity.value,
      scoreFit: refs.scoreFit.value
    },
    output: { metrics, risk, fit, seniority, tags, execText, summaryText }
  }));
}

function restore(){
  const raw = localStorage.getItem("assessment_sonova_session");
  if(!raw) return;
  const data = JSON.parse(raw);

  Object.assign(state, data.state || {});
  refs.candidateName.value = data.fields?.candidateName || "";
  refs.recruiterName.value = data.fields?.recruiterName || "";
  refs.jobProfile.value = data.fields?.jobProfile || "";
  refs.preDecision.value = data.fields?.preDecision || "Em análise";
  refs.recruiterNotes.value = data.fields?.recruiterNotes || "";
  refs.scoreClarity.value = data.fields?.scoreClarity || 70;
  refs.scoreConsistency.value = data.fields?.scoreConsistency || 70;
  refs.scoreMaturity.value = data.fields?.scoreMaturity || 70;
  refs.scoreFit.value = data.fields?.scoreFit || 70;
  refs.selectedAnimal.textContent = state.animal || "Nenhuma";

  document.querySelectorAll(".choice-card").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.animal === state.animal);
  });
  document.querySelectorAll(".option-card").forEach(btn => {
    const group = btn.dataset.group;
    btn.classList.toggle("active", state[group] === btn.dataset.value);
  });

  bindRanges();
  if (data.output?.summaryText) {
    refs.copySummary.value = data.output.summaryText;
    refs.executiveSummary.textContent = data.output.execText || "";
    refs.seniority.textContent = `${data.output.seniority} | Aderência final ${data.output.fit}`;
    refs.mCollaboration.textContent = data.output.metrics.collaboration;
    refs.mAssertiveness.textContent = data.output.metrics.assertiveness;
    refs.mPressure.textContent = data.output.metrics.pressure;
    refs.mOrganization.textContent = data.output.metrics.organization;
    refs.mAutonomy.textContent = data.output.metrics.autonomy;
    refs.mRisk.textContent = riskLabel(data.output.risk);
    refs.tagsBox.innerHTML = "";
    (data.output.tags || []).forEach(tag => {
      const el = document.createElement("span");
      el.className = "tag";
      el.textContent = tag;
      refs.tagsBox.appendChild(el);
    });
  }
}

function clearAll(){
  localStorage.removeItem("assessment_sonova_session");
  location.reload();
}

refs.generateBtn.addEventListener("click", generate);
refs.clearBtn.addEventListener("click", clearAll);
refs.copyBtn.addEventListener("click", async () => {
  if (!refs.copySummary.value) return;
  await navigator.clipboard.writeText(refs.copySummary.value);
  refs.copyBtn.textContent = "Copiado";
  setTimeout(() => refs.copyBtn.textContent = "Copiar resumo", 1200);
});
refs.downloadBtn.addEventListener("click", () => {
  const payload = localStorage.getItem("assessment_sonova_session");
  if(!payload) return;
  const blob = new Blob([payload], {type: "application/json"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "assessment_sonova_resultado.json";
  link.click();
  URL.revokeObjectURL(link.href);
});

bindRanges();
bindChoices();
restore();
