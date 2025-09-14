/**
 * LinkShield Documentation Utilities
 * Interactive features and accessibility helpers for documentation
 */

export interface DocsUtilsConfig {
  enableCopyButtons?: boolean;
  enableBackToTop?: boolean;
  enableSmoothScroll?: boolean;
  enableToc?: boolean;
}

export class DocsUtils {
  private config: Required<DocsUtilsConfig>;
  private observer?: IntersectionObserver;
  private backToTopButton?: HTMLElement;

  constructor(config: DocsUtilsConfig = {}) {
    this.config = {
      enableCopyButtons: true,
      enableBackToTop: true,
      enableSmoothScroll: true,
      enableToc: true,
      ...config
    };

    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') return;

    if (this.config.enableCopyButtons) {
      this.addCopyButtons();
    }

    if (this.config.enableBackToTop) {
      this.addBackToTopButton();
      this.setupScrollObserver();
    }

    if (this.config.enableSmoothScroll) {
      this.setupSmoothScroll();
    }

    if (this.config.enableToc) {
      this.generateTableOfContents();
    }

    this.setupKeyboardNavigation();
    this.setupPrintStyles();
  }

  /**
   * Add copy buttons to code blocks
   */
  private addCopyButtons(): void {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (!pre || pre.tagName !== 'PRE') return;

      const button = document.createElement('button');
      button.className = 'docs-code-copy';
      button.textContent = 'Copy';
      button.setAttribute('aria-label', 'Copy code to clipboard');
      button.setAttribute('type', 'button');

      button.addEventListener('click', async () => {
        const text = codeBlock.textContent || '';
        
        try {
          await navigator.clipboard.writeText(text);
          button.textContent = 'Copied!';
          button.classList.add('copied');
          
          setTimeout(() => {
            button.textContent = 'Copy';
            button.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy text: ', err);
          button.textContent = 'Failed';
          setTimeout(() => {
            button.textContent = 'Copy';
          }, 2000);
        }
      });

      pre.style.position = 'relative';
      pre.appendChild(button);
    });
  }

  /**
   * Add back to top button
   */
  private addBackToTopButton(): void {
    const button = document.createElement('button');
    button.className = 'docs-back-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Back to top');
    button.setAttribute('type', 'button');
    
    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(button);
    this.backToTopButton = button;
  }

  /**
   * Setup scroll observer for back to top button
   */
  private setupScrollObserver(): void {
    if (!this.backToTopButton) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            this.backToTopButton?.classList.add('visible');
          } else {
            this.backToTopButton?.classList.remove('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Create a sentinel element at the top of the page
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    sentinel.style.position = 'absolute';
    sentinel.style.top = '0';
    document.body.insertBefore(sentinel, document.body.firstChild);
    
    this.observer.observe(sentinel);
  }

  /**
   * Setup smooth scrolling for anchor links
   */
  private setupSmoothScroll(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]');
      
      if (link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  }

  /**
   * Generate table of contents from headings
   */
  private generateTableOfContents(): void {
    const headings = document.querySelectorAll('.docs-container h2, .docs-container h3, .docs-container h4');
    if (headings.length === 0) return;

    const toc = document.createElement('div');
    toc.className = 'docs-toc';
    
    const title = document.createElement('h3');
    title.textContent = 'Table of Contents';
    toc.appendChild(title);

    const list = document.createElement('ul');
    
    headings.forEach((heading, index) => {
      if (!(heading instanceof HTMLElement)) return;
      
      const id = heading.id || `heading-${index}`;
      heading.id = id;

      const level = parseInt(heading.tagName.substring(1));
      const item = document.createElement('li');
      const link = document.createElement('a');
      
      link.href = `#${id}`;
      link.textContent = heading.textContent;
      link.style.paddingLeft = `${(level - 2) * 16}px`;
      
      item.appendChild(link);
      list.appendChild(item);
    });

    toc.appendChild(list);

    // Insert TOC after the first heading
    const firstHeading = document.querySelector('.docs-container h1, .docs-container h2');
    if (firstHeading) {
      firstHeading.insertAdjacentElement('afterend', toc);
    }
  }

  /**
   * Setup keyboard navigation
   */
  private setupKeyboardNavigation(): void {
    document.addEventListener('keydown', (e) => {
      // Alt + ArrowUp to go to top
      if (e.altKey && e.key === 'ArrowUp') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Alt + / to focus search
      if (e.altKey && e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    });
  }

  /**
   * Setup print-specific behaviors
   */
  private setupPrintStyles(): void {
    window.addEventListener('beforeprint', () => {
      // Ensure all code blocks are fully visible
      const codeBlocks = document.querySelectorAll('pre');
      codeBlocks.forEach(pre => {
        pre.style.overflow = 'visible';
        pre.style.whiteSpace = 'pre-wrap';
      });
    });

    window.addEventListener('afterprint', () => {
      // Restore original styles
      const codeBlocks = document.querySelectorAll('pre');
      codeBlocks.forEach(pre => {
        pre.style.overflow = '';
        pre.style.whiteSpace = '';
      });
    });
  }

  /**
   * Update heading anchors
   */
  public updateHeadingAnchors(): void {
    const headings = document.querySelectorAll('.docs-container h2, .docs-container h3, .docs-container h4, .docs-container h5, .docs-container h6');
    
    headings.forEach((heading, index) => {
      if (!(heading instanceof HTMLElement)) return;
      
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }

      // Add anchor link
      const anchor = document.createElement('a');
      anchor.href = `#${heading.id}`;
      anchor.className = 'docs-anchor';
      anchor.innerHTML = '#';
      anchor.setAttribute('aria-label', 'Link to this heading');
      anchor.style.opacity = '0';
      anchor.style.marginLeft = '0.5rem';
      anchor.style.textDecoration = 'none';
      anchor.style.transition = 'opacity 0.2s';

      heading.appendChild(anchor);
      
      heading.addEventListener('mouseenter', () => {
        anchor.style.opacity = '1';
      });
      
      heading.addEventListener('mouseleave', () => {
        anchor.style.opacity = '0';
      });
    });
  }

  /**
   * Destroy the utils instance
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }

    const backToTopButton = document.querySelector('.docs-back-to-top');
    if (backToTopButton) {
      backToTopButton.remove();
    }

    const codeCopyButtons = document.querySelectorAll('.docs-code-copy');
    codeCopyButtons.forEach(button => button.remove());

    const toc = document.querySelector('.docs-toc');
    if (toc) {
      toc.remove();
    }
  }
}

/**
 * Initialize documentation utilities
 */
export function initDocsUtils(config?: DocsUtilsConfig): DocsUtils {
  return new DocsUtils(config);
}

/**
 * Utility function to highlight syntax (basic implementation)
 */
export function highlightSyntax(code: string, language: string): string {
  // Basic syntax highlighting - in production, use Prism.js or similar
  const keywords = {
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export'],
    typescript: ['interface', 'type', 'enum', 'namespace', 'declare', 'readonly'],
    css: ['display', 'position', 'color', 'background', 'margin', 'padding', 'border'],
    html: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'class', 'id', 'src', 'href']
  };

  let highlighted = code;
  
  if (keywords[language as keyof typeof keywords]) {
    keywords[language as keyof typeof keywords].forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="token keyword">${keyword}</span>`);
    });
  }

  return highlighted;
}

/**
 * Utility for responsive tables
 */
export function makeTablesResponsive(): void {
  const tables = document.querySelectorAll('.docs-container table');
  
  tables.forEach(table => {
    const wrapper = document.createElement('div');
    wrapper.className = 'docs-table-wrapper';
    wrapper.style.overflowX = 'auto';
    wrapper.style.margin = '1rem 0';
    
    table.parentNode?.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
}

/**
 * Utility for keyboard shortcuts help modal
 */
export function showKeyboardShortcuts(): void {
  const modal = document.createElement('div');
  modal.className = 'docs-shortcuts-modal';
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    max-width: 400px;
    width: 90%;
  `;

  modal.innerHTML = `
    <h3>Keyboard Shortcuts</h3>
    <ul style="list-style: none; padding: 0;">
      <li><kbd>Alt + ↑</kbd> Go to top</li>
      <li><kbd>Alt + /</kbd> Focus search</li>
      <li><kbd>Escape</kbd> Close this modal</li>
    </ul>
    <button onclick="this.parentElement.remove()" style="margin-top: 1rem;">Close</button>
  `;

  document.body.appendChild(modal);
  modal.focus();

  // Close on escape
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.remove();
    }
  });
}

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on a documentation page
    if (document.querySelector('.docs-container')) {
      initDocsUtils();
    }
  });
}