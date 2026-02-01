import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UserProfile, ReportData } from '../types';

interface DashboardProps {
    user: UserProfile;
}

const MOCK_REPORT: ReportData = {
    personalityTraits: [
        { name: 'Créativité', value: 85 },
        { name: 'Logique', value: 60 },
        { name: 'Social', value: 75 },
        { name: 'Leadership', value: 90 },
        { name: 'Rigueur', value: 45 },
    ],
    recommendedSchools: [
        { id: '1', name: 'HETIC', matchScore: 95, type: 'Digital & Tech', location: 'Montreuil' },
        { id: '2', name: 'Gobelins', matchScore: 88, type: 'Image & Design', location: 'Paris' },
        { id: '3', name: 'IESEG', matchScore: 72, type: 'Commerce', location: 'Lille/Paris' },
    ],
    careerPaths: [
        "Product Designer",
        "Chef de Projet Digital",
        "Directeur Artistique"
    ]
};

const ParentDashboard: React.FC<DashboardProps> = ({ user }) => {
    const report = MOCK_REPORT;

    if (!user.isPremium) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <i className="fas fa-lock text-2xl"></i>
                    </div>
                    <h2 className="text-xl font-bold text-primary mb-2">Accès Réservé</h2>
                    <p className="text-gray-500 text-sm">L'espace parent est exclusif aux membres Premium.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-primary tracking-tight">Tableau de Bord</h1>
                    <p className="text-gray-500">Analyse pour <span className="font-semibold text-accent-start">{user.displayName}</span></p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 text-sm font-bold shadow-sm transition-all">
                        <i className="fas fa-download mr-2 text-gray-400"></i> PDF
                    </button>
                    <button className="px-5 py-2.5 bg-primary text-white rounded-full hover:bg-gray-800 text-sm font-bold shadow-lg transition-all">
                        <i className="fas fa-share-alt mr-2"></i> Partager
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Stats */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <i className="fas fa-brain"></i>
                        </div>
                        <h3 className="text-xl font-bold text-primary">Traits de Personnalité</h3>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={report.personalityTraits} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{fill: '#64748B', fontSize: 13, fontWeight: 500}} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    cursor={{fill: '#F8FAFC'}}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="value" barSize={16} radius={[0, 10, 10, 0]}>
                                    {report.personalityTraits.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366F1' : '#8B5CF6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Métiers */}
                <div className="bg-gradient-to-br from-primary to-slate-900 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                    <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
                        <i className="fas fa-rocket text-accent-start"></i> Top Carrières
                    </h3>
                    <ul className="space-y-4 relative z-10">
                        {report.careerPaths.map((job, idx) => (
                            <li key={idx} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent-start to-accent-end flex items-center justify-center text-sm font-bold text-white shadow-lg">
                                    {idx + 1}
                                </span>
                                <span className="font-medium tracking-wide text-sm">{job}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Écoles */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                            <i className="fas fa-university"></i>
                        </div>
                        <h3 className="text-xl font-bold text-primary">Écoles Recommandées</h3>
                    </div>
                    <div className="space-y-4">
                        {report.recommendedSchools.map(school => (
                            <div key={school.id} className="flex items-center justify-between p-5 border border-gray-50 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer group bg-background/30">
                                <div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-accent-start transition-colors">{school.name}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{school.type} • {school.location}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                        {school.matchScore}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lettre */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                            <i className="fas fa-pen-nib"></i>
                        </div>
                        <h3 className="text-xl font-bold text-primary">Lettre de Motivation</h3>
                    </div>
                    <div className="flex-1 bg-gray-50 p-8 rounded-3xl border-2 border-dashed border-gray-200 text-center flex flex-col items-center justify-center group hover:border-accent-start/30 transition-colors">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                            <i className="fas fa-magic text-2xl text-accent-start"></i>
                        </div>
                        <p className="text-gray-600 text-sm mb-6 max-w-xs leading-relaxed">L'IA rédige une première ébauche parfaite pour Parcoursup.</p>
                        <button className="px-6 py-3 bg-white border border-gray-200 text-primary font-bold rounded-full shadow-sm hover:bg-primary hover:text-white hover:border-transparent transition-all text-sm">
                            Générer le brouillon
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;