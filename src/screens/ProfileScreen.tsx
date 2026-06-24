import type { Profile } from "../types";
import {
  commitmentLabel, genderLabel, intentLabel, roleLabel, roleSeekingLabel,
  seekingGenderLabel, stageLabel,
} from "../data/labels";

export function ProfileScreen({
  profile,
  matchCount,
  savedCount,
  passCount,
}: {
  profile: Profile;
  matchCount: number;
  savedCount: number;
  passCount: number;
}) {
  return (
    <div className="profile-wrap">
      <div className="profile-hero">
        <div className="avatar">{profile.initials}</div>
        <div>
          <div className="ph-name">{profile.name}</div>
          <div className="ph-loc">
            <i className="ti ti-map-pin" /> {profile.location}
            {profile.remoteOk ? " · Open to remote" : ""}
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="pstat"><div className="n">{matchCount}</div><div className="l">Matches</div></div>
        <div className="pstat"><div className="n">{savedCount}</div><div className="l">Saved</div></div>
        <div className="pstat"><div className="n">{passCount}</div><div className="l">Passed</div></div>
      </div>

      <div className="profile-section">
        <div className="ps-label">Matching</div>
        <div className="profile-row">
          <i className="ti ti-user-star" />
          <span className="pr-k">You bring</span>
          <span className="pr-v">{roleLabel[profile.brings]}</span>
        </div>
        <div className="profile-row">
          <i className="ti ti-target" />
          <span className="pr-k">Seeking</span>
          <span className="pr-v">{roleSeekingLabel[profile.seeking].replace("Seeking ", "")}</span>
        </div>
        <div className="profile-row">
          <i className="ti ti-seeding" />
          <span className="pr-k">Stage</span>
          <span className="pr-v">{stageLabel[profile.stage]}</span>
        </div>
        <div className="profile-row">
          <i className="ti ti-flame" />
          <span className="pr-k">Commitment</span>
          <span className="pr-v">{commitmentLabel[profile.commitment]}</span>
        </div>
      </div>

      <div className="profile-section">
        <div className="ps-label">Dating</div>
        <div className="profile-row">
          <i className="ti ti-heart" />
          <span className="pr-k">Open to dating founders</span>
          <span className="pr-v">{profile.dating.open ? "On" : "Off"}</span>
        </div>
        {profile.dating.open && (
          <>
            <div className="profile-row">
              <i className="ti ti-user" />
              <span className="pr-k">I am</span>
              <span className="pr-v">
                {genderLabel[profile.dating.gender]}{profile.age ? `, ${profile.age}` : ""}
              </span>
            </div>
            <div className="profile-row">
              <i className="ti ti-eye" />
              <span className="pr-k">Interested in</span>
              <span className="pr-v">{profile.dating.seeking.map((g) => seekingGenderLabel[g]).join(", ")}</span>
            </div>
            <div className="profile-row">
              <i className="ti ti-flag" />
              <span className="pr-k">Looking for</span>
              <span className="pr-v">{intentLabel[profile.dating.intent]}</span>
            </div>
          </>
        )}
      </div>

      <div className="profile-section">
        <div className="ps-label">Interested in</div>
        <div className="profile-tags">
          {profile.industries.map((ind) => (
            <span key={ind} className="pill pill-teal">{ind}</span>
          ))}
        </div>
      </div>

      <div className="profile-section">
        <div className="ps-label">Pitch</div>
        <p className="profile-pitch">{profile.pitch}</p>
      </div>
    </div>
  );
}
