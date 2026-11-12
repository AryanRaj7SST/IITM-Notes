import os
import math

def generate_mlt_svg():
    width = 640
    height = 440
    pad_x = 75
    pad_y = 55

    # Target minimum at (2, 3)
    # Map w1 in [-1, 5], w2 in [0, 6]
    def to_screen(w1, w2):
        sx = pad_x + ((w1 - (-1.0)) / 6.0) * (width - 2 * pad_x)
        sy = (height - pad_y) - ((w2 - 0.0) / 6.0) * (height - 2 * pad_y)
        return sx, sy

    svg = []
    svg.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="100%" height="auto" class="w-full max-w-2xl mx-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 shadow-sm">')
    
    # Grid lines & ticks
    for w1 in range(-1, 6):
        x1, y1 = to_screen(w1, 0)
        x2, y2 = to_screen(w1, 6)
        svg.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="currentColor" stroke-opacity="0.08" stroke-width="1"/>')
        svg.append(f'<text x="{x1:.1f}" y="{y1 + 18:.1f}" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6" font-family="monospace">{w1}</text>')

    for w2 in range(0, 7):
        x1, y1 = to_screen(-1, w2)
        x2, y2 = to_screen(5, w2)
        svg.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="currentColor" stroke-opacity="0.08" stroke-width="1"/>')
        svg.append(f'<text x="{x1 - 10:.1f}" y="{y1 + 4:.1f}" text-anchor="end" font-size="11" fill="currentColor" opacity="0.6" font-family="monospace">{w2}</text>')

    # Axes
    x_axis_start, y_axis_start = to_screen(-1, 0)
    x_axis_end, y_axis_end = to_screen(5, 0)
    svg.append(f'<line x1="{x_axis_start:.1f}" y1="{y_axis_start:.1f}" x2="{x_axis_end:.1f}" y2="{y_axis_end:.1f}" stroke="currentColor" stroke-width="1.5" opacity="0.8"/>')
    svg.append(f'<text x="{width - 25}" y="{y_axis_start + 4:.1f}" font-size="13" font-weight="bold" fill="currentColor" font-family="serif">w₁ (Weight 1)</text>')

    y_start, y_end = to_screen(-1, 0), to_screen(-1, 6)
    svg.append(f'<line x1="{y_start[0]:.1f}" y1="{y_start[1]:.1f}" x2="{y_end[0]:.1f}" y2="{y_end[1]:.1f}" stroke="currentColor" stroke-width="1.5" opacity="0.8"/>')
    svg.append(f'<text x="{y_end[0] - 5:.1f}" y="{pad_y - 20}" font-size="13" font-weight="bold" fill="currentColor" font-family="serif">w₂ (Weight 2)</text>')

    # Elliptical contour curves around (2, 3)
    center_x, center_y = to_screen(2, 3)
    radii = [0.6, 1.2, 1.9, 2.7, 3.5]
    for r in radii:
        rx_screen = (r / 6.0) * (width - 2 * pad_x)
        ry_screen = ((r / math.sqrt(2.0)) / 6.0) * (height - 2 * pad_y)
        svg.append(f'<ellipse cx="{center_x:.1f}" cy="{center_y:.1f}" rx="{rx_screen:.1f}" ry="{ry_screen:.1f}" fill="none" stroke="#10b981" stroke-width="1.3" stroke-dasharray="4 3" opacity="0.5"/>')

    # Optimum Point
    svg.append(f'<circle cx="{center_x:.1f}" cy="{center_y:.1f}" r="4.5" fill="#059669"/>')
    svg.append(f'<text x="{center_x + 10:.1f}" y="{center_y - 10:.1f}" font-size="12" font-weight="bold" fill="#059669" font-family="sans-serif">Global Min w* = (2.0, 3.0)</text>')

    # Arrow marker definition
    svg.append('''<defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ef4444"/>
      </marker>
    </defs>''')

    # Gradient Descent Trajectory
    points = [(-0.6, 5.4), (0.6, 4.45), (1.35, 3.82), (1.72, 3.42), (1.9, 3.2), (1.97, 3.08), (2.0, 3.0)]
    screen_pts = [to_screen(p[0], p[1]) for p in points]

    for i in range(len(screen_pts) - 1):
        x1, y1 = screen_pts[i]
        x2, y2 = screen_pts[i+1]
        svg.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="#ef4444" stroke-width="2.2" marker-end="url(#arrow)"/>')
        svg.append(f'<circle cx="{x1:.1f}" cy="{y1:.1f}" r="3.5" fill="#ef4444"/>')
        svg.append(f'<text x="{x1 + 6:.1f}" y="{y1 - 6:.1f}" font-size="10.5" font-weight="bold" fill="#dc2626" font-family="monospace">t={i}</text>')

    svg.append(f'<circle cx="{screen_pts[-1][0]:.1f}" cy="{screen_pts[-1][1]:.1f}" r="4" fill="#059669"/>')

    # Legend / Caption
    svg.append(f'<text x="{width/2:.1f}" y="{height - 12:.1f}" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.75" font-family="sans-serif">Figure 1.1: Gradient Descent Trajectory on Convex MSE Loss Contours J(w₁, w₂) with Learning Rate η = 0.15</text>')
    svg.append('</svg>')

    os.makedirs('public/images/mlt', exist_ok=True)
    with open('public/images/mlt/gradient_descent_contour.svg', 'w', encoding='utf-8') as f:
        f.write('\n'.join(svg))
    print('Generated public/images/mlt/gradient_descent_contour.svg')

def generate_bdm_svg():
    # ER Diagram / Relational Schema flow
    width = 620
    height = 240
    svg = []
    svg.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="100%" height="auto" class="w-full max-w-2xl mx-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 shadow-sm">')
    
    # Table 1: CUSTOMERS
    svg.append('''
    <g transform="translate(40, 40)">
      <rect width="160" height="130" rx="8" fill="none" stroke="#7c3aed" stroke-width="1.5" class="stroke-violet-600 dark:stroke-violet-400"/>
      <rect width="160" height="32" rx="8" fill="#7c3aed" opacity="0.1"/>
      <text x="80" y="21" text-anchor="middle" font-size="12" font-weight="bold" fill="#7c3aed" font-family="sans-serif">CUSTOMERS</text>
      <text x="15" y="55" font-size="11" font-family="monospace" fill="currentColor"><tspan font-weight="bold" fill="#7c3aed">PK </tspan>customer_id</text>
      <text x="15" y="75" font-size="11" font-family="monospace" fill="currentColor">   name</text>
      <text x="15" y="95" font-size="11" font-family="monospace" fill="currentColor">   email (UNIQUE)</text>
      <text x="15" y="115" font-size="11" font-family="monospace" fill="currentColor">   tier_level</text>
    </g>
    ''')

    # Table 2: ORDERS
    svg.append('''
    <g transform="translate(420, 40)">
      <rect width="160" height="130" rx="8" fill="none" stroke="#7c3aed" stroke-width="1.5" class="stroke-violet-600 dark:stroke-violet-400"/>
      <rect width="160" height="32" rx="8" fill="#7c3aed" opacity="0.1"/>
      <text x="80" y="21" text-anchor="middle" font-size="12" font-weight="bold" fill="#7c3aed" font-family="sans-serif">ORDERS</text>
      <text x="15" y="55" font-size="11" font-family="monospace" fill="currentColor"><tspan font-weight="bold" fill="#7c3aed">PK </tspan>order_id</text>
      <text x="15" y="75" font-size="11" font-family="monospace" fill="currentColor"><tspan font-weight="bold" fill="#0284c7">FK </tspan>customer_id</text>
      <text x="15" y="95" font-size="11" font-family="monospace" fill="currentColor">   order_date</text>
      <text x="15" y="115" font-size="11" font-family="monospace" fill="currentColor">   total_amount</text>
    </g>
    ''')

    # Relationship connector
    svg.append('''
    <g>
      <line x1="200" y1="105" x2="420" y2="105" stroke="#7c3aed" stroke-width="2" stroke-dasharray="5 3"/>
      <circle cx="205" cy="105" r="4" fill="#7c3aed"/>
      <polygon points="415,100 425,105 415,110" fill="#7c3aed"/>
      <rect x="260" y="85" width="100" height="24" rx="4" fill="#f5f3ff" class="dark:fill-zinc-800" stroke="#c4b5fd" stroke-width="1"/>
      <text x="310" y="101" text-anchor="middle" font-size="10" font-weight="bold" fill="#7c3aed" font-family="sans-serif">1 : N (Places)</text>
    </g>
    ''')

    svg.append(f'<text x="{width/2:.1f}" y="{height - 15:.1f}" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.75" font-family="sans-serif">Figure 1.1: 1-to-Many Relational Integrity Constraint with Foreign Key Cascade</text>')
    svg.append('</svg>')

    os.makedirs('public/images/bdm', exist_ok=True)
    with open('public/images/bdm/relational_schema.svg', 'w', encoding='utf-8') as f:
        f.write('\n'.join(svg))
    print('Generated public/images/bdm/relational_schema.svg')

if __name__ == '__main__':
    generate_mlt_svg()
    generate_bdm_svg()

