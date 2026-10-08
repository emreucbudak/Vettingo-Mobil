import { Question } from "../../domain/entities/Assessment";

const effectOptions = [
  {
    id: "api-404",
    text: "API 404 hatası döndürdüğü için fetch sonsuza kadar tekrar eder.",
  },
  {
    id: "dependency-array",
    text: "userData bağımlılık dizisindedir. Güncellenmesi effect’i tekrar tetikler.",
  },
  {
    id: "userid-render",
    text: "userId okunması her seferinde yeniden render tetikler.",
  },
  {
    id: "missing-await",
    text: "fetch çağrısında await olmadığı için sonsuz döngü oluşur.",
  },
];
export const questions: Question[] = [
  {
    id: "react-effects",
    category: "Technical Assessment",
    difficulty: "Hard",
    prompt:
      "Aşağıdaki React bileşenindeki sonsuz döngünün en olası sebebi nedir?",
    fileName: "UserProfile.jsx",
    code: "useEffect(() => {\n  fetch(`/api/users/${userId}`)\n    .then(res => res.json())\n    .then(data => setUserData(data));\n}, [userData, userId]);",
    options: effectOptions,
  },
  {
    id: "typescript-immutability",
    category: "TypeScript",
    difficulty: "Medium",
    prompt:
      "Bir koleksiyon referansının yeniden atanmasını hangi bildirim engeller?",
    fileName: "profile.ts",
    code: "const skills = ['React Native', 'TypeScript'];",
    options: [
      { id: "var", text: "var" },
      { id: "const", text: "const" },
      { id: "let", text: "let" },
      { id: "any", text: "any" },
    ],
  },
  {
    id: "react-mount",
    category: "React Native",
    difficulty: "Medium",
    prompt:
      "Bileşen açıldığında bir kez çalışması gereken asenkron istek nerede başlatılmalıdır?",
    fileName: "Profile.tsx",
    code: "useEffect(() => {\n  loadProfile();\n}, []);",
    options: [
      { id: "render", text: "Render fonksiyonu içinde" },
      { id: "effect", text: "Boş bağımlılık dizili useEffect içinde" },
      { id: "cleanup", text: "Effect cleanup içinde" },
      { id: "global", text: "Global değişkende" },
    ],
  },
  {
    id: "current-question",
    category: "Technical Assessment",
    difficulty: "Hard",
    prompt: "userData güncellendikçe effect neden tekrar çalışır?",
    fileName: "UserProfile.jsx",
    code: "useEffect(() => {\n  fetch(`/api/users/${userId}`)\n    .then(res => res.json())\n    .then(data => setUserData(data));\n}, [userData, userId]);",
    options: [
      { id: "api-error", text: effectOptions[0].text },
      { id: "userdata-loop", text: effectOptions[1].text },
      { id: "access-render", text: effectOptions[2].text },
      { id: "await-loop", text: effectOptions[3].text },
    ],
  },
  {
    id: "react-keys",
    category: "React Native",
    difficulty: "Easy",
    prompt:
      "React listelerinde kararlı key değerleri neyi korumaya yardımcı olur?",
    fileName: "Skills.tsx",
    code: "<SkillTile key={skill.id} skill={skill} />",
    options: [
      { id: "network", text: "Ağ önbelleği" },
      { id: "identity", text: "Bileşen kimliği ve ilişkili state" },
      { id: "theme", text: "Renk teması" },
      { id: "route", text: "Route adı" },
    ],
  },
  ...Array.from({ length: 15 }, (_, i): Question => ({
    id: `question-${i + 6}`,
    category: "Software Engineering",
    difficulty: i % 2 ? "Medium" : "Hard",
    prompt: "Bakımı kolay bir uygulama için hangi yaklaşım uygundur?",
    fileName: `solution_${i + 6}.ts`,
    code: "const result = service.process(input);",
    options: [
      {
        id: "separation",
        text: "Sorumlulukları ayırın ve bağımlılıkları açık tutun.",
      },
      {
        id: "global-state",
        text: "Tüm state’i değiştirilebilir global değişkenlere taşıyın.",
      },
      {
        id: "ignore-errors",
        text: "Hataları yok sayın ve sonsuza kadar yeniden deneyin.",
      },
      { id: "duplicate", text: "Her ekranda aynı kodu kopyalayın." },
    ],
  })),
];
