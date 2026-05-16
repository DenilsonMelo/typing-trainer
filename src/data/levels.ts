import type { Level } from "../types";

export const LEVELS: Level[] = [
  { id: 1, name: "Home Esquerda", desc: "ASDF G — mão esquerda na posição base",
    words: [
      "fada", "saga", "gaga", "das", "safa", "sad", "fads", "gas", "dag", "safas", "dada",
      "asa", "asas", "daga", "fagas", "sagas", "fadas", "dadas", "fag", "gad", "gaff", "gags",
      "asdf", "fasd", "gads", "sags", "dagas", "asaga", "fagada",
    ] },
  { id: 2, name: "Home Direita", desc: "H JKL — mão direita na posição base",
    words: [
      "hall", "hulk", "hill", "kill", "skill", "shall", "jail", "lash", "jhl", "lhk",
      "hash", "lush", "hush", "kilt", "lilt", "kiln", "junk", "khan", "slash", "stash",
      "lulls", "hulks", "halks", "halls", "jolly", "lilac", "khaki", "hijack",
    ] },
  { id: 3, name: "Home Completa", desc: "Ambas as mãos juntas na home row",
    words: [
      "flash", "glass", "flags", "salad", "slash", "flask", "glad", "half", "falls", "halls", "skill", "shall",
      "hash", "dash", "gash", "lash", "sash", "alas", "gala", "lads", "lags", "sags", "gags",
      "dahls", "halal", "kasha", "askl", "ghadj",
    ] },
  { id: 4, name: "Row Superior", desc: "QWERT YUIOP — alcance para cima",
    words: [
      "write", "power", "quiet", "route", "tower", "quote", "equip", "query", "outer", "optic", "wiper", "rivet",
      "trip", "type", "tour", "twit", "yore", "wire", "writ", "writer", "tipper", "ripper",
      "proper", "prior", "potter", "yuppie", "torque", "report", "poetry",
    ] },
  { id: 5, name: "Row Inferior", desc: "ZXCVB NM — alcance para baixo",
    words: [
      "cabin", "venom", "camel", "bunch", "bench", "bacon", "climb", "blank", "crumb", "nerve", "comic", "civic",
      "comb", "bomb", "lamb", "numb", "envy", "movie", "vacant", "mocha", "vivid", "buzz",
      "zinc", "exam", "mixer", "canvas", "banana", "vacuum", "nomad",
    ] },
  { id: 6, name: "Centro Split", desc: "TG + YH — onde o teclado se divide",
    words: [
      "tight", "ghost", "youth", "thigh", "girth", "byte", "eight", "gutsy", "bight", "gust", "typo", "buggy",
      "tough", "yacht", "highlight", "weighty", "twitchy", "haughty", "rights", "tights",
      "myth", "myths", "lengthy", "yogurt", "thirsty", "naughty", "hyphen",
    ] },
  { id: 7, name: "Números", desc: "1234567890 — row de números",
    words: [
      "123", "456", "789", "100", "2024", "365", "500", "1000", "42", "99", "007", "314", "256",
      "512", "768", "404", "200", "1024", "2048", "4096", "2026", "1969", "1984",
      "1234", "5678", "9012", "8675309", "8080", "3141",
    ] },
  { id: 8, name: "Palavras PT-BR", desc: "Vocabulário em português",
    words: [
      "teclado", "dividido", "digitar", "tecla", "postura", "coluna", "dedo", "polegar",
      "camada", "layout", "firme", "rapido", "treino", "foco", "ritmo", "fluxo", "ajuste", "pulso", "forma", "base",
      "mecanico", "switch", "linear", "tatil", "stagger", "ergonomico", "split", "metade",
      "ombro", "punho", "olhar", "altura", "respirar", "constante", "preciso", "atalho",
      "controle", "espaco", "leitura", "treinar",
    ] },
  { id: 9, name: "Frases", desc: "Frases completas para velocidade",
    words: [
      "o teclado split melhora a postura",
      "cada dedo tem sua coluna no silakka",
      "pratique todos os dias por dez minutos",
      "o polegar controla espaco e camadas",
      "nao olhe para baixo confie nos dedos",
      "a precisao vem antes da velocidade",
      "use o vial para remapear as teclas",
      "layers substituem teclas que faltam",
      "o split separa as maos na largura do ombro",
      "column stagger segue o formato natural",
      "ritmo constante vale mais que velocidade pura",
      "digitar sem olhar e o primeiro grande passo",
      "ajuste o tenting ate as palmas relaxarem",
      "mantenha os punhos retos e os ombros baixos",
      "erros consistentes pedem pratica direcionada",
      "o melhor layout e o que voce ajustou pra voce",
      "comece devagar e ganhe velocidade com o tempo",
      "respire fundo entre as rodadas de treino",
      "a home row e seu ponto de partida sempre",
      "pequenos ganhos diarios viram grandes saltos",
    ] },
  { id: 10, name: "Símbolos (L1)", desc: "! @ # $ % & * ( ) { } [ ] etc.",
    layer: 1,
    words: [
      "!@#$%", "^&*()", "{a, b}", "[1, 2, 3]", "(x + y)", "100%", "#tag", "<3",
      "user@email", "$100", "a && b", "x || y", "if (x > 0)", "{key: val}",
      "arr[0]", "obj.key", "fn(a, b)", "x = 5;", "y += 2", "*** ok ***",
      "10 / 2", "x++", "1 + 2 = 3", "<head>", "</body>", "p > q",
      "!important", "$user", "@route", "#anchor", "&amp;", "|&|",
    ] },
  { id: 11, name: "Numpad (L3)", desc: "Operações numéricas e pad direito",
    layer: 3,
    words: [
      "1+2", "10-5", "3*4", "20/4", "100+50", "9*9", "256/8",
      "1024/2", "42+8", "7*7", "100-25", "12+12", "15/3", "8*8",
      "144/12", "33-11", "1000/4", "5+5+5", "2.5*4", "0.1+0.9",
      "3.14", "1.5+2.5", "1,2,3", "10,20,30", "100,200,300",
      "365", "1024", "2048", "9999", "1234+5678",
    ] },
];

export function generateText(level: Level): string {
  const shuffled = [...level.words].sort(() => Math.random() - 0.5);
  if (level.id === 9) return shuffled.slice(0, 3).join(". ");
  if (level.id === 7) return shuffled.slice(0, 8).join(" ");
  return shuffled.slice(0, 12 + Math.floor(Math.random() * 5)).join(" ");
}
