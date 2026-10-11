import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { mockBadges } from '../data/mockBadges';

const GamificationContext = createContext();

export function GamificationProvider({ children }) {
  const [xp, setXp] = useState(() => {
    return parseInt(localStorage.getItem('gamilearn_xp') || '1820', 10);
  });

  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('gamilearn_streak') || '12', 10);
  });

  const [badges, setBadges] = useState(() => {
    try {
      const saved = localStorage.getItem('gamilearn_badges');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0 && parsed.some(b => b.id === 'bdg-cpp-master')) {
          return parsed;
        }
      }
    } catch (e) {}
    localStorage.setItem('gamilearn_badges', JSON.stringify(mockBadges));
    return mockBadges;
  });

  const [rewardModal, setRewardModal] = useState({
    isOpen: false,
    title: '',
    xpGained: 0,
    subtitle: '',
    icon: '🎉'
  });

  useEffect(() => {
    localStorage.setItem('gamilearn_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('gamilearn_streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('gamilearn_badges', JSON.stringify(badges));
  }, [badges]);

  const level = Math.floor(xp / 150) + 1;
  const levelProgress = Math.min(100, Math.round(((xp % 150) / 150) * 100));

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback if confetti canvas fails
    }
  };

  const addXP = (points, title = "Great job!", subtitle = "You earned knowledge points!") => {
    const prevLevel = Math.floor(xp / 150) + 1;
    const newXP = xp + points;
    const newLevel = Math.floor(newXP / 150) + 1;

    setXp(newXP);
    fireConfetti();

    if (newLevel > prevLevel) {
      setRewardModal({
        isOpen: true,
        title: `Level Up! You reached Level ${newLevel}! 🏆`,
        xpGained: points,
        subtitle: "Incredible dedication to learning in your community!",
        icon: '🌟'
      });
    } else {
      setRewardModal({
        isOpen: true,
        title: title,
        xpGained: points,
        subtitle: subtitle,
        icon: '⚡'
      });
    }
  };

  const closeRewardModal = () => {
    setRewardModal(prev => ({ ...prev, isOpen: false }));
  };

  const incrementStreak = () => {
    setStreak(prev => prev + 1);
  };

  const unlockBadge = (badgeId) => {
    setBadges(prev => prev.map(b => {
      if (b.id === badgeId && !b.unlocked) {
        addXP(b.xpReward, `Badge Unlocked: ${b.title}!`, b.description);
        return { ...b, unlocked: true, unlockedDate: "Just now" };
      }
      return b;
    }));
  };

  return (
    <GamificationContext.Provider
      value={{
        xp,
        streak,
        level,
        levelProgress,
        badges,
        rewardModal,
        addXP,
        closeRewardModal,
        unlockBadge,
        incrementStreak,
        fireConfetti
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useXP() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useXP must be used within a GamificationProvider');
  }
  return context;
}
