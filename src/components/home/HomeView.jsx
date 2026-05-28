import HeroHeader from "./HeroHeader";
import HeadToHead from "./HeadToHead";
import QuickStats from "./QuickStats";
import Leaderboard from "./Leaderboard";
import { MonthPreviewGrid } from "./MonthPreviewCard";
import FeaturedEditorial from "./FeaturedEditorial";
import PlayerRosterGrid from "./PlayerRosterGrid";
import PartnershipsRivalries from "./PartnershipsRivalries";
import { Footer } from "../layout/Footer";

export default function HomeView({ stats, bp, navigate, statsMode, setStatsMode }) {
  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      <HeroHeader stats={stats} bp={bp} />
      <HeadToHead stats={stats} bp={bp} />
      <QuickStats stats={stats} bp={bp} />
      <Leaderboard 
        stats={stats} 
        bp={bp} 
        statsMode={statsMode} 
        setStatsMode={setStatsMode} 
        navigate={navigate} 
      />
      <MonthPreviewGrid navigate={navigate} bp={bp} />
      <FeaturedEditorial bp={bp} />
      <PlayerRosterGrid stats={stats} bp={bp} navigate={navigate} />
      <PartnershipsRivalries stats={stats} bp={bp} />
      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
