import { compile } from '@mdx-js/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

async function test(str) {
  try {
    await compile(str, {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    });
    console.log('SUCCESS!');
  } catch (e) {
    console.log('FAIL:', e.message);
  }
}

const snippet = `<Collapsible title="Full Matrix Calculus Derivation (Step-by-Step)" defaultOpen={true}>

Let us expand the quadratic form step by step:

$$
\\begin{aligned}
J(\\mathbf{w}) &= \\frac{1}{2n} (\\mathbf{X}\\mathbf{w} - \\mathbf{y})^T (\\mathbf{X}\\mathbf{w} - \\mathbf{y}) \\\\
&= \\frac{1}{2n} \\left( (\\mathbf{X}\\mathbf{w})^T - \\mathbf{y}^T \\right) (\\mathbf{X}\\mathbf{w} - \\mathbf{y}) \\quad &&\\text{[Transpose of difference: } (A - B)^T = A^T - B^T\\text{]} \\\\
&= \\frac{1}{2n} \\left( \\mathbf{w}^T \\mathbf{X}^T \\mathbf{X} \\mathbf{w} - \\mathbf{w}^T \\mathbf{X}^T \\mathbf{y} - \\mathbf{y}^T \\mathbf{X} \\mathbf{w} + \\mathbf{y}^T \\mathbf{y} \\right) \\quad &&\\text{[Distributive property of matrix multiplication]}
\\end{aligned}
$$

Note that $\\mathbf{w}^T \\mathbf{X}^T \\mathbf{y}$ is a $1 \\times 1$ scalar. For any scalar $s$, $s^T = s$. Therefore:

$$
(\\mathbf{w}^T \\mathbf{X}^T \\mathbf{y})^T = \\mathbf{y}^T (\\mathbf{X}^T)^T (\\mathbf{w}^T)^T = \\mathbf{y}^T \\mathbf{X} \\mathbf{w}
$$

The two middle terms are identical! Combining them gives:

$$
J(\\mathbf{w}) = \\frac{1}{2n} \\left( \\mathbf{w}^T \\mathbf{X}^T \\mathbf{X} \\mathbf{w} - 2 \\mathbf{y}^T \\mathbf{X} \\mathbf{w} + \\mathbf{y}^T \\mathbf{y} \\right)
$$

Now, we take the gradient with respect to $\\mathbf{w}$ using matrix calculus identities:

1. $\\nabla_{\\mathbf{w}} (\\mathbf{w}^T \\mathbf{A} \\mathbf{w}) = 2 \\mathbf{A} \\mathbf{w}$ when $\\mathbf{A} = \\mathbf{X}^T \\mathbf{X}$ is symmetric.
2. $\\nabla_{\\mathbf{w}} (\\mathbf{b}^T \\mathbf{w}) = \\mathbf{b}$ where $\\mathbf{b} = \\mathbf{X}^T \\mathbf{y}$.
3. $\\nabla_{\\mathbf{w}} (\\mathbf{y}^T \\mathbf{y}) = \\mathbf{0}$ because it does not depend on $\\mathbf{w}$.

Applying these identities:

$$
\\nabla_{\\mathbf{w}} J(\\mathbf{w}) = \\frac{1}{2n} \\left( 2 \\mathbf{X}^T \\mathbf{X} \\mathbf{w} - 2 \\mathbf{X}^T \\mathbf{y} \\right) = \\frac{1}{n} \\left( \\mathbf{X}^T \\mathbf{X} \\mathbf{w} - \\mathbf{X}^T \\mathbf{y} \\right)
$$

Setting $\\nabla_{\\mathbf{w}} J(\\mathbf{w}) = \\mathbf{0}$:

$$
\\mathbf{X}^T \\mathbf{X} \\mathbf{w} - \\mathbf{X}^T \\mathbf{y} = \\mathbf{0} \\implies \\mathbf{X}^T \\mathbf{X} \\mathbf{w} = \\mathbf{X}^T \\mathbf{y}
$$

Assuming $\\mathbf{X}^T \\mathbf{X}$ is invertible (full column rank), multiply both sides from the left by $(\\mathbf{X}^T \\mathbf{X})^{-1}$:

$$
\\mathbf{w}^* = (\\mathbf{X}^T \\mathbf{X})^{-1} \\mathbf{X}^T \\mathbf{y}
$$

</Collapsible>`;

test(snippet);
