import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

# Schematic only: no data from the lecture. Marginal utility falls as consumption rises
# (and turns negative); marginal cost rises; they meet at Q*.
q = np.linspace(1, 10, 200)
mu = 10 - 1.8 * (q - 1)      # decreasing, becomes negative
mc = 1 + 0.9 * (q - 1)       # increasing
# intersection: 10 - 1.8x = 1 + 0.9x  ->  x = 9/2.7
x_star = 9 / 2.7
q_star = 1 + x_star
y_star = 1 + 0.9 * x_star
assert abs((10 - 1.8 * x_star) - y_star) < 1e-9

fig, ax = plt.subplots(figsize=(6.5, 4.5))
ax.plot(q, mu, label="Marginal utility (MU)")
ax.plot(q, mc, label="Marginal cost (MC)")
ax.axhline(0, color="gray", linewidth=0.8)
ax.scatter([q_star], [y_star], zorder=3)
ax.annotate("MU = MC", (q_star, y_star), textcoords="offset points", xytext=(10, 10))
ax.text(8.0, -3.0, "MU below zero:\nnegative utility", ha="center")
ax.set_xlabel("Quantity consumed (schematic)")
ax.set_ylabel("Marginal utility / marginal cost (schematic)")
ax.set_xticks([])
ax.set_yticks([])
ax.set_title("Diminishing marginal utility and MU = MC (schematic)")
ax.legend(loc="upper right")
fig.tight_layout()
fig.savefig("public/images/bdm/w1-l2-marginal-utility.svg")