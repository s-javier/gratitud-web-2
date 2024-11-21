export default function Logo(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" {...props}>
      <rect
        width={280}
        height={80}
        x={10}
        y={10}
        fill="#fff"
        stroke="#ff8ba7"
        strokeWidth={1.5}
        rx={8}
      />
      <path
        fill="none"
        stroke="#ffb5c2"
        strokeLinecap="round"
        strokeWidth={1.5}
        d="M80 30c20 0 40-5 70-5s50 5 70 5M80 70c20 0 40 5 70 5s50-5 70-5"
      />
      <path
        fill="none"
        stroke="#ffd1dc"
        strokeLinecap="round"
        strokeWidth={2}
        d="M85 35c5 0 10 5 10 10s-5 5-10 5m130-15c-5 0-10 5-10 10s5 5 10 5"
      />
      <g fill="#ff8ba7" fillOpacity={0.6}>
        <circle cx={150} cy={25} r={2} />
        <circle cx={150} cy={75} r={2} />
        <circle cx={80} cy={30} r={2} />
        <circle cx={220} cy={30} r={2} />
        <circle cx={80} cy={70} r={2} />
        <circle cx={220} cy={70} r={2} />
      </g>
      <path stroke="#ffeef2" strokeOpacity={0.4} strokeWidth={3} d="M100 30h100M100 70h100" />
      <circle
        cx={95}
        cy={50}
        r={25}
        fill="none"
        stroke="#ffeef2"
        strokeOpacity={0.3}
        strokeWidth={2}
      />
    </svg>
  )
}
