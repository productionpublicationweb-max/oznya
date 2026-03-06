// components/DesignHumain.tsx
'use client';

import { motion } from 'framer-motion';
import { User, Zap, Heart, Brain, Shield, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface DesignHumainData {
  type: 'Manifestor' | 'Generator' | 'Manifesting Generator' | 'Projector' | 'Reflector';
  profile: string; // ex: "3/5"
  authority: 'Emotional' | 'Sacral' | 'Splenic' | 'Ego' | 'Self-Projected' | 'Mental' | 'Lunar';
  strategy: string;
  notSelf: string;
  centers: {
    head: boolean;
    ajna: boolean;
    throat: boolean;
    g: boolean;
    heart: boolean;
    sacral: boolean;
    solarPlexus: boolean;
    spleen: boolean;
    root: boolean;
  };
  gates: number[];
  channels: string[];
}

export function DesignHumain({ userId }: { userId: string }) {
  const [data, setData] = useState<DesignHumainData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateDesignHumain = async (birthData: {
    date: string;
    time: string;
    location: string;
  }) => {
    setIsCalculating(true);
    
    // Appel API pour calculer le Design Humain
    // Tu peux utiliser une API comme Jovian Archive ou créer ton propre système
    
    try {
      const response = await fetch('/api/design-humain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(birthData)
      });
      
      const result = await response.json();
      setData(result.data);
      
      // Sauvegarder dans le profil utilisateur
      await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          designHumain: result.data
        })
      });
      
    } catch (error) {
      console.error('Erreur calcul Design Humain:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const typeColors = {
    'Manifestor': 'from-red-500 to-orange-500',
    'Generator': 'from-orange-500 to-yellow-500',
    'Manifesting Generator': 'from-yellow-500 to-green-500',
    'Projector': 'from-green-500 to-cyan-500',
    'Reflector': 'from-cyan-500 to-blue-500'
  };

  const typeIcons = {
    'Manifestor': Zap,
    'Generator': Heart,
    'Manifesting Generator': Sparkles,
    'Projector': Brain,
    'Reflector': Shield
  };

  if (!data) {
    return (
      <DesignHumainForm onSubmit={calculateDesignHumain} isLoading={isCalculating} />
    );
  }

  const TypeIcon = typeIcons[data.type];

  return (
    <div className="space-y-6">
      {/* Type énergétique */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          p-6 rounded-2xl bg-gradient-to-r ${typeColors[data.type]}
          text-white relative overflow-hidden
        `}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <TypeIcon className="w-8 h-8" />
            <div>
              <h3 className="text-2xl font-bold">{data.type}</h3>
              <p className="text-sm opacity-90">Profil {data.profile}</p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Autorité:</span> {data.authority}
            </div>
            <div>
              <span className="font-semibold">Stratégie:</span> {data.strategy}
            </div>
            <div>
              <span className="font-semibold">Non-Soi:</span> {data.notSelf}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bodygraph visuel */}
      <BodygraphVisual centers={data.centers} />

      {/* Centres définis/ouverts */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(data.centers).map(([center, isDefined]) => (
          <motion.div
            key={center}
            whileHover={{ scale: 1.05 }}
            className={`
              p-3 rounded-lg border transition-all
              ${isDefined 
                ? 'bg-cyan-500/10 border-cyan-500/30' 
                : 'bg-slate-800/50 border-slate-700'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <div className={`
                w-3 h-3 rounded-full
                ${isDefined ? 'bg-cyan-400' : 'bg-slate-600'}
              `} />
              <span className="text-sm text-white capitalize">
                {center}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isDefined ? 'Défini' : 'Ouvert'}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Portes activées */}
      <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
        <h4 className="text-sm font-semibold text-white mb-3">
          Portes Activées
        </h4>
        <div className="flex flex-wrap gap-2">
          {data.gates.map(gate => (
            <span
              key={gate}
              className="px-2 py-1 bg-violet-500/20 border border-violet-500/30 rounded text-xs text-violet-300"
            >
              Porte {gate}
            </span>
          ))}
        </div>
      </div>

      {/* Canaux */}
      <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
        <h4 className="text-sm font-semibold text-white mb-3">
          Canaux Définis
        </h4>
        <div className="space-y-2">
          {data.channels.map(channel => (
            <div
              key={channel}
              className="text-xs text-slate-300 p-2 bg-slate-700/50 rounded"
            >
              {channel}
            </div>
          ))}
        </div>
      </div>

      {/* Recommandations personnalisées */}
      <DesignHumainRecommendations data={data} />
    </div>
  );
}

// Composant visuel du Bodygraph
function BodygraphVisual({ centers }: { centers: DesignHumainData['centers'] }) {
  return (
    <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-xl border border-slate-700 p-4">
      <svg viewBox="0 0 300 400" className="w-full h-full">
        {/* Head */}
        <circle
          cx="150"
          cy="40"
          r="20"
          fill={centers.head ? '#06b6d4' : 'transparent'}
          stroke="#64748b"
          strokeWidth="2"
        />
        
        {/* Ajna */}
        <polygon
          points="130,80 170,80 150,110"
          fill={centers.ajna ? '#06b6d4' : 'transparent'}
          stroke="#64748b"
          strokeWidth="2"
        />
        
        {/* Throat */}
        <rect
          x="130"
          y="130"
          width="40"
          height="30"
          fill={centers.throat ? '#06b6d4' : 'transparent'}
          stroke="#64748b"
          strokeWidth="2"
        />
        
        {/* G Center */}
        <polygon
          points="150,180 170,200 150,220 130,200"
          fill={centers.g ? '#06b6d4' : 'transparent'}
          stroke="#64748b"
          strokeWidth="2"
        />
        
        {/* Heart/Ego */}
        <polygon
          points="190,180 210,200 190,220 170,200"
          fill={centers.heart ? '#06b6d4' : 'transparent'}
          stroke="#64748b"
          strokeWidth="2"
        />
        
        {/* Solar Plexus */}
        <polygon
          points="110,180 90,200 110,220 130,200"
          fill={centers.solarPlexus ? '#06b6d4' : 'transparent'}
          stroke="#64748b"
          strokeWidth="2"
        />
        
        {/* Sacral */}
        <rect
          x="130"
          y="240"
          width="40"
          height="30"
          rx="5"
          fill={centers.sacral ? '#06b6d4' : 'transparent'}
          stroke="#64748b"
          strokeWidth="2"
        />
        
        {/* Spleen */}
        <polygon
          points="90,240 70,260 90,280 110,260"
          fill={centers.spleen ? '#06b6d4' : 'transparent'}
          stroke="#64748b"
          strokeWidth="2"
        />
        
        {/* Root */}
        <rect
          x="130"
          y="300"
          width="40"
          height="30"
          fill={centers.root ? '#06b6d4' : 'transparent'}
          stroke="#64748b"
          strokeWidth="2"
        />
        
        {/* Connexions entre centres (exemple) */}
        <line x1="150" y1="60" x2="150" y2="80" stroke="#64748b" strokeWidth="2" />
        <line x1="150" y1="110" x2="150" y2="130" stroke="#64748b" strokeWidth="2" />
        <line x1="150" y1="160" x2="150" y2="180" stroke="#64748b" strokeWidth="2" />
      </svg>
    </div>
  );
}

// Recommandations basées sur le Design Humain
function DesignHumainRecommendations({ data }: { data: DesignHumainData }) {
  const recommendations = {
    'Manifestor': {
      coffret: 'Coffret Regard Sécurisant',
      advice: 'En tant que Manifestor, tu es faite pour initier. Informe avant d\'agir pour éviter la résistance.'
    },
    'Generator': {
      coffret: 'Coffret Sérénité Radicale',
      advice: 'Attends de répondre à la vie. Ta satisfaction vient de faire ce qui allume ton feu sacré.'
    },
    'Manifesting Generator': {
      coffret: 'Coffret Abondance',
      advice: 'Multi-passionnée par nature, suis ton énergie et informe avant d\'agir.'
    },
    'Projector': {
      coffret: 'Coffret De la Fuite à la Présence',
      advice: 'Attends l\'invitation et la reconnaissance. Ta sagesse guide les autres.'
    },
    'Reflector': {
      coffret: 'Coffret Armistice du Soir',
      advice: 'Attends un cycle lunaire complet avant les grandes décisions. Tu es le miroir de ta communauté.'
    }
  };

  const rec = recommendations[data.type];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl"
    >
      <h4 className="text-sm font-semibold text-white mb-2">
        ✨ Recommandations Personnalisées
      </h4>
      <p className="text-sm text-slate-300 mb-3">
        {rec.advice}
      </p>
      <button className="w-full px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-violet-500/50 transition-all">
        Découvrir {rec.coffret}
      </button>
    </motion.div>
  );
}

// Formulaire de calcul
function DesignHumainForm({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-slate-300 mb-2">
          Date de naissance
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">
          Heure de naissance
        </label>
        <input
          type="time"
          value={formData.time}
          onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">
          Lieu de naissance
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
          placeholder="Ville, Pays"
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
      >
        {isLoading ? 'Calcul en cours...' : 'Calculer mon Design Humain'}
      </button>
    </form>
  );
}
