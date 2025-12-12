import { LearnConnectLayout } from "@/components/layout/LearnConnectLayout";
import { examCategories } from "@/data/exams";
import { useLanguage } from "@/contexts/consolidated-language-context";

export default function LearnConnectExams() {
  const { language } = useLanguage();

  return (
    <LearnConnectLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          {language === "tr" ? "Sınav Kategorileri" : "Exam Categories"}
        </h1>
        <p className="text-purple-100">
          {language === "tr"
            ? "TYT, AYT ve LGS yapısı; ders ve ünite placeholder'ları ile."
            : "TYT, AYT, and LGS structure with lessons and unit placeholders."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {examCategories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-xl border border-white/20 bg-white/5 p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{cat.title[language]}</h2>
              <span className="text-xs rounded-full bg-white/10 px-2 py-1 border border-white/20">
                {cat.id}
              </span>
            </div>
            <p className="text-sm text-purple-100">{cat.description[language]}</p>
            <div className="space-y-2">
              {cat.lessons.map((lesson) => (
                <div key={lesson.id} className="rounded-lg bg-white/5 border border-white/10 p-3">
                  <div className="font-semibold text-sm">{lesson.title[language]}</div>
                  <ul className="mt-2 space-y-1 text-xs text-purple-100">
                    {lesson.units.map((unit) => (
                      <li key={unit.id} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                        {unit.title[language]}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </LearnConnectLayout>
  );
}

