import { useUserStore } from './store/user-store';
import { useGameStore } from './store/game-store';

/** 
 * Syncs the current local game state to the server.
 * Merges data from both UserStore and GameStore. 
 */
export async function syncGameData() {
    try {
        const u = useUserStore.getState();
        const g = useGameStore.getState();

        const data = {
            totalXP: u.totalXP,
            gems: u.gems,
            avatar: u.avatar,
            loginStreak: u.loginStreak,
            longestStreak: u.longestStreak,
            lastLoginDate: u.lastLoginDate,
            dailyTarget: u.dailyTarget,
            dailyHistory: u.dailyHistory,
            badges: u.badges,
            shopItems: u.shopItems,
            levels: g.levels
        };

        const res = await fetch('/api/user/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            console.error('Failed to sync game data');
        }
    } catch (error) {
        console.error('Error syncing game data:', error);
    }
}
