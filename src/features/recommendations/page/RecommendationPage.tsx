import type { CSSProperties } from "react";
import StatsCard from "../../products/components/StatCard";
import TitleSize from "../../../styles/TitleSize";
import { FaBoxOpen, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function RecommendationPage(){
  return (
    <div style={styles.mainContainer}>

        <TitleSize 
          title="AI Tretment Plan Management"
          subtitle="Manage condition-based recommendations used by the facial health AI"
          />
        
        <div style={styles.statsContainer}>
            <StatsCard
              title="Total Recommendations"
              value={2}
              icon={FaBoxOpen}
            />
    
            <StatsCard
              title="Conditions Covered"
              value={4}
              icon={FaCheckCircle}
            />
    
            <StatsCard
              title="High Severity Rules"
              value={3}
              icon={FaTimesCircle}
            />
        </div>

        <div style={styles.searchContainer}>

        </div>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  container: {
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#ffffff",
  },

  statsContainer: {
    display: "flex",
    gap: 10,
  }

};