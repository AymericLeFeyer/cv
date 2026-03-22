import type { Profile } from '../types';
import { API_BASE } from '../config';
import { formatRange, formatDate } from '../utils/date';
import { iconUrl } from '../config';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';

// ── Header ────────────────────────────────────────────────────────────────

function ContactRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="pv-contact">
      <span className="pv-contact-icon">{icon}</span>
      <span>{value}</span>
    </div>
  );
}

function PrintHeader({ profile }: { profile: Profile }) {
  const { name, role, contacts } = profile;
  const linkedinHandle = contacts.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '');
  return (
    <div className="pv-header">
      <div className="pv-header-inner">
        <div className="pv-identity">
          <img src={`${API_BASE}/icons/companies/perso.jpeg`} alt={name} className="pv-avatar" />
          <div>
            <h1 className="pv-name">{name}</h1>
            <p className="pv-role">{role}</p>
          </div>
        </div>
        <div className="pv-contacts">
          <ContactRow value={contacts.email} icon={
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          } />
          <ContactRow value="aymeric.lefeyer.fr" icon={
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          } />
          <ContactRow value={contacts.phone} icon={
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.38 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          } />
          <ContactRow value={linkedinHandle} icon={
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          } />
          <ContactRow value={contacts.github} icon={
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          } />
        </div>
      </div>
    </div>
  );
}

// ── Missions ──────────────────────────────────────────────────────────────

function PrintMissions({ profile }: { profile: Profile }) {
  const professional = profile.missions
    .filter(m => !m.is_side_project)
    .sort((a, b) => {
      const aDate = a.start_date === 'Present' ? '9999' : a.start_date;
      const bDate = b.start_date === 'Present' ? '9999' : b.start_date;
      return bDate.localeCompare(aDate);
    });

  return (
    <section className="pv-section">
      <h2 className="pv-section-title">Missions</h2>
      <div className="pv-missions">
        {professional.map((m, i) => {
          const sortedTechs = [...m.technologies].sort((a, b) => b.frequency - a.frequency);
          return (
            <div key={i} className="pv-mission">
              <div className="pv-mission-header">
                <div className="pv-mission-meta">
                  <span className="pv-mission-title">{m.title}</span>
                  <span className="pv-mission-sep">·</span>
                  <span className="pv-mission-company">{m.company}</span>
                </div>
                <span className="pv-mission-dates">{formatRange(m.start_date, m.end_date)}</span>
              </div>
              {m.context && <p className="pv-mission-context">{m.context}</p>}
              {m.tasks.length > 0 && (
                <ul className="pv-mission-tasks">
                  {m.tasks.map((task, j) => <li key={j}>{task}</li>)}
                </ul>
              )}
              {sortedTechs.length > 0 && (
                <div className="pv-mission-techs">
                  {sortedTechs.map(t => (
                    <span key={t.name} className="pv-tech-tag">{t.name}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Certifications (dans la section Formation) ───────────────────────────

function PrintCertifications({ profile }: { profile: Profile }) {
  const certs = [...profile.events]
    .filter(e => e.type === 'certification')
    .sort((a, b) => b.date.localeCompare(a.date));

  if (certs.length === 0) return null;

  return (
    <div className="pv-certs">
      <p className="subsection-title">Certifications</p>
      <div className="formations-grid">
        {certs.map((c, i) => (
          <div key={i} className="formation-item">
            <img
              src={iconUrl(c.icon)}
              alt={c.name}
              className="formation-icon"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="formation-degree">{c.name}</span>
            <span className="formation-date">{formatDate(c.date)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PrintView ────────────────────────────────────────────────────────────

export function PrintView({ profile }: { profile: Profile }) {
  return (
    <div id="cv-print" className="print-view">
      <PrintHeader profile={profile} />
      <PrintMissions profile={profile} />
      <ExperienceSection companies={profile.companies} />
      <div className="pv-formation-block">
        <EducationSection education={profile.education} />
        <PrintCertifications profile={profile} />
      </div>
    </div>
  );
}
