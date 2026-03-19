import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            Partenaire Platinum Atlassian
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Generateur de Propositions<br />
            <span className="text-blue-600">BleuLemon</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Creez des propositions commerciales professionnelles en quelques minutes grace a l&apos;intelligence artificielle.
          </p>
          <Link href="/proposal" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            Nouvelle proposition
            <span>&rarr;</span>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-semibold text-gray-800 mb-2">Formulaire guide</h3>
            <p className="text-sm text-gray-600">Renseignez les informations client et projet en 10 etapes structurees.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold text-gray-800 mb-2">Generation IA</h3>
            <p className="text-sm text-gray-600">Claude genere le contenu redactionnel adapte au contexte client.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">📄</div>
            <h3 className="font-semibold text-gray-800 mb-2">Export Word</h3>
            <p className="text-sm text-gray-600">Telechargez la proposition au format .docx prete a envoyer.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
