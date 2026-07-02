export default function BackgroundGlare() {
  return (
    <div className="background-glare-shell" aria-hidden="true">
      <div className="background-glare-tilt">
        <div className="background-glare-panel">
          <span className="background-glare-core" />
          <span className="background-glare-ray background-glare-ray-main" />
          <span className="background-glare-ray background-glare-ray-soft" />
          <span className="background-glare-orb background-glare-orb-one" />
          <span className="background-glare-orb background-glare-orb-two" />
          <span className="background-glare-orb background-glare-orb-three" />
        </div>
      </div>
    </div>
  );
}
