import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

F = np.linspace(0, 100, 200)
T = (1200 - 12 * F) / 6
fig, ax = plt.subplots(figsize=(6, 4.5))
ax.plot(F, T, label="6T + 12F = 1200")
ax.fill_between(F, 0, T, alpha=0.12)
ax.scatter([40], [120], zorder=3)
ax.annotate("F = 40, T = 120", (40, 120), textcoords="offset points", xytext=(10, 8))
ax.scatter([0, 100], [200, 0], zorder=3)
ax.annotate("T = 200, F = 0", (0, 200), textcoords="offset points", xytext=(8, -4))
ax.annotate("F = 100, T = 0", (100, 0), textcoords="offset points", xytext=(-80, 10))
ax.set_xlabel("Filter coffee F (cups per day)")
ax.set_ylabel("Tea T (cups per day)")
ax.set_xlim(0, 110); ax.set_ylim(0, 220)
ax.set_title("Ramu's stall: budget of 1200 rupees per day")
ax.legend(); fig.tight_layout()
fig.savefig("public/images/bdm/w1-l3-ramu-ppf.svg"); plt.close(fig)

B = np.linspace(0, 20, 200)
W = (10000 - 500 * B) / 200
fig, ax = plt.subplots(figsize=(6, 4.5))
ax.plot(B, W, label="500B + 200W = 10000")
mask = B >= 5
ax.fill_between(B[mask], 0, W[mask], alpha=0.12)
ax.axvline(5, linestyle="--", label="B = 5 (minimum)")
ax.scatter([5], [37.5], zorder=3)
ax.annotate("B = 5, W = 37.5", (5, 37.5), textcoords="offset points", xytext=(10, 8))
ax.set_xlabel("Basmati rice B (acres)"); ax.set_ylabel("Wheat W (acres)")
ax.set_xlim(0, 22); ax.set_ylim(0, 55)
ax.set_title("Organic farm: water limit of 10,000 litres per day")
ax.legend(); fig.tight_layout()
fig.savefig("public/images/bdm/w1-l3-farm-water.svg"); plt.close(fig)

assert 6 * 120 + 12 * 40 == 1200
assert 4 * 120 + 6 * 40 == 720
assert 500 * 5 + 200 * 37.5 == 10000
assert 15000 * 5 + 8000 * 37.5 == 375000
print("asserts ok")

