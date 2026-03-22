import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../typs/User';

const getFullName = (user: User): string => {
  const { first_name, middle_name, last_name, suffix } = user;
  return [first_name, middle_name, last_name, suffix]
    .filter((name): name is string => Boolean(name && name.trim()))
    .join(' ');
};


const formatDate = (dateValue?: number | string | Date): string => {
  if (!dateValue) return '—';
  return new Date(dateValue).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Component: Reusable Data Field
 */
const DataField: React.FC<{ label: string; value?: string | number }> = ({
  label,
  value,
}) => (
  <div style={styles.fieldContainer}>
    <label style={styles.fieldLabel}>{label}</label>
    <div style={styles.fieldValueBox}>{value || '—'}</div>
  </div>
);

interface ViewUserPageProps {
  user: User;
}

const ViewUserPage: React.FC<ViewUserPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const fullName = getFullName(user);

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.contentContainer}>
        
        {/* HEADER SECTION */}
        <header style={styles.header}>
          <div style={styles.breadcrumb}>
            Users <span style={styles.breadcrumbActive}>/ User Details</span>
          </div>
          <h1 style={styles.pageTitle}>User Profile</h1>
          <p style={styles.pageSubtitle}>
            Review comprehensive user records and account activity history.
          </p>
        </header>

        {/* PROFILE OVERVIEW */}
        <section style={styles.profileHero}>
          <img
            src={user.avatar_url || 'https://via.placeholder.com/100'}
            style={styles.avatar}
            alt={`${fullName}'s avatar`}
          />
          <div style={styles.profileText}>
            <h2 style={styles.displayName}>{fullName}</h2>
            <span style={styles.statusBadge}>
              {user.status || 'Active'} Account
            </span>
          </div>
        </section>

        {/* INFORMATION GRID */}
        <main style={styles.mainGrid}>
          {/* COLUMN 1: PERSONAL & CONTACT */}
          <div style={styles.gridColumn}>
            <h3 style={styles.sectionHeading}>Personal Information</h3>
            <DataField label="User ID" value={user.id ? `#${user.id}` : undefined} />
            <DataField label="Date of Birth" value={formatDate(user.date_of_birth)} />

            <h3 style={{ ...styles.sectionHeading, marginTop: '16px' }}>Contact Details</h3>
            <DataField label="Phone Number" value={user.phone_number} />
            <DataField label="Email Address" value={""} />
            <DataField label="Residential Address" value={user.address} />
          </div>

          {/* COLUMN 2: ACCOUNT RECORDS */}
          <div style={styles.gridColumn}>
            <h3 style={styles.sectionHeading}>System Records</h3>
            <DataField label="Registration Date" value={formatDate(user.created_at)} />
            
            
            <div style={styles.fieldContainer}>
              <label style={styles.fieldLabel}>Last System Activity</label>
              <div style={styles.activityRow}>
                <span style={styles.activityTime}>
                  {new Date(user.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span style={styles.activityDate}>{formatDate(user.updated_at)}</span>
              </div>
            </div>
          </div>
        </main>

        {/* ACTION FOOTER */}
        <footer style={styles.footer}>
          <button 
            type="button" 
            style={styles.secondaryBtn} 
            onClick={() => navigate('/users')}
          >
            Return to Directory
          </button>
          <button 
            type="button" 
            style={styles.primaryBtn}
            onClick={() => window.print()}
          >
            Export Document (PDF)
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ViewUserPage;

// ---------------------------------------------------------
// DESIGN SYSTEM / STYLES
// ---------------------------------------------------------

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    backgroundColor: '#F9FAFB',
    fontFamily: '"Inter", -apple-system, sans-serif',
    color: '#111827',
  },
  contentContainer: {
    margin: '0 auto',
    backgroundColor: '#FFFFFF',
    padding: '48px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  header: {
    marginBottom: '48px',
  },
  breadcrumb: {
    fontSize: '13px',
    color: '#6B7280',
    marginBottom: '12px',
  },
  breadcrumbActive: {
    color: '#111827',
    fontWeight: 500,
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: 700,
    margin: 0,
    letterSpacing: '-0.02em',
  },
  pageSubtitle: {
    fontSize: '15px',
    color: '#6B7280',
    marginTop: '6px',
  },
  profileHero: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    paddingBottom: '40px',
    borderBottom: '1px solid #F3F4F6',
    marginBottom: '40px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #F3F4F6',
  },
  profileText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  displayName: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 600,
  },
  statusBadge: {
    display: 'inline-flex',
    fontSize: '11px',
    backgroundColor: '#F3F4F6',
    color: '#374151',
    padding: '4px 10px',
    borderRadius: '99px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    width: 'fit-content',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '60px',
  },
  gridColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sectionHeading: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#111827',
    marginBottom: '8px',
    borderLeft: '3px solid #000',
    paddingLeft: '12px',
  },
  fieldContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  fieldLabel: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
  },
  fieldValueBox: {
    padding: '12px',
    fontSize: '14px',
    backgroundColor: '#F9FAFB',
    borderRadius: '6px',
    border: '1px solid #E5E7EB',
    color: '#1F2937',
  },
  activityRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#F9FAFB',
    borderRadius: '6px',
    border: '1px solid #E5E7EB',
  },
  activityTime: {
    fontWeight: 700,
    fontSize: '14px',
  },
  activityDate: {
    fontSize: '13px',
    color: '#6B7280',
  },
  footer: {
    marginTop: '64px',
    paddingTop: '32px',
    borderTop: '1px solid #F3F4F6',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
  },
  primaryBtn: {
    backgroundColor: '#111827',
    color: '#FFFFFF',
    padding: '12px 28px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    color: '#374151',
    padding: '12px 24px',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
  },
};