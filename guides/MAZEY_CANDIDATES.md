# Mazey Utility Candidates

The project uses Mazey 5.6.9. The candidates below are not present in that version's public API and are ranked by cross-project value, existing reuse inside this repository, and how clearly their behavior can be generalized.

## 1. `observeElementResize`

- **Purpose:** Observe an element with `ResizeObserver`, coalesce rapid notifications, and return lifecycle-safe cleanup.
- **Why it is reusable:** `src/utils/resize-event.js` supports Scrollbar, Cascader, Select, Tabs, Carousel, and Table. The current pair of add/remove functions stores private fields on DOM elements and can remove the wrong listener when a callback is absent. A subscription API would apply to component libraries and ordinary browser applications without Vue coupling.
- **Proposed API:**

  ```ts
  function observeElementResize(
    element: Element,
    listener: (entry: ResizeObserverEntry) => void,
    options?: {
      delay?: number;
      box?: ResizeObserverBoxOptions;
      ResizeObserver?: typeof ResizeObserver;
    }
  ): () => void;
  ```

  The returned cleanup should be idempotent. Internally, use a `WeakMap` rather than mutating the observed element, and disconnect the observer when its final listener is removed.

## 2. `resolveObjectPath`

- **Purpose:** Resolve a dot/bracket path and return its parent object, final key, value, and existence state.
- **Why it is reusable:** `getValueByPath`, `getPropByPath`, table row identity, sorting, Form, Select, and Table all overlap around nested property access. A single resolver would remove subtly different handling of missing values, inherited properties, falsy intermediate values, and strict failures.
- **Proposed API:**

  ```ts
  type ObjectPath = string | readonly (string | number)[];

  function resolveObjectPath(
    value: unknown,
    path: ObjectPath,
    options?: {
      strict?: boolean;
      ownPropertiesOnly?: boolean;
    }
  ): {
    parent: object | null;
    key: string | number | null;
    value: unknown;
    exists: boolean;
  };
  ```

  The implementation should define empty paths, array indices, escaped separators, nullish intermediates, and prototype-sensitive keys explicitly.

## 3. `ensureElementVisible`

- **Purpose:** Scroll a container only enough to reveal a target element.
- **Why it is reusable:** `src/utils/scroll-into-view.js` is used by Select and Cascader Panel and is independent of their business logic. The same nearest-edge behavior is common in menus, command palettes, listboxes, trees, and virtualized controls.
- **Proposed API:**

  ```ts
  function ensureElementVisible(
    container: HTMLElement,
    target: HTMLElement | null,
    options?: {
      axis?: "vertical" | "horizontal" | "both";
      align?: "nearest" | "start" | "center" | "end";
    }
  ): boolean;
  ```

  Return whether scrolling changed. Validate containment and calculate offsets relative to the supplied container rather than assuming a direct offset parent.

## 4. `measureTextareaHeight`

- **Purpose:** Calculate textarea height and optional minimum height from content, computed styles, and row limits.
- **Why it is reusable:** `packages/input/src/calcTextareaHeight.js` contains browser-only logic that is useful in autosizing textareas across frameworks. Its CSS box-model handling is more substantial than application-specific component code.
- **Proposed API:**

  ```ts
  function measureTextareaHeight(
    textarea: HTMLTextAreaElement,
    options?: {
      minRows?: number;
      maxRows?: number | null;
    }
  ): {
    height: number;
    minHeight?: number;
  };
  ```

  Scope measurement nodes per `Document`, guarantee cleanup with `try...finally`, validate row counts, and return numbers so callers choose CSS units.

## 5. `measureScrollbarWidth`

- **Purpose:** Measure the native scrollbar gutter for a document.
- **Why it is reusable:** `src/utils/scrollbar-width.js` is shared by Scrollbar and Table Layout. Modal, overlay, table, and virtual-scroll implementations commonly need the same measurement.
- **Proposed API:**

  ```ts
  function measureScrollbarWidth(
    document?: Document,
    options?: { cache?: boolean }
  ): number;
  ```

  Cache per `Document` with a `WeakMap`, return `0` when no usable DOM is available, and always remove the temporary measurement elements.

## 6. `throttleAnimationFrame`

- **Purpose:** Limit a callback to one invocation per animation frame.
- **Why it is reusable:** `rafThrottle` handles wheel and drag work in Image Viewer. Timer-based `throttle` in Mazey does not provide frame alignment, cancellation, or equivalent argument-selection semantics.
- **Proposed API:**

  ```ts
  interface AnimationFrameThrottled<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): void;
    cancel(): void;
    flush(): void;
  }

  function throttleAnimationFrame<T extends (...args: any[]) => any>(
    callback: T,
    options?: { arguments?: "first" | "latest" }
  ): AnimationFrameThrottled<T>;
  ```

  Preserve caller context, define first-versus-latest argument behavior, and provide a timer fallback only when its cancellation semantics remain equivalent.

## 7. `escapeRegExp`

- **Purpose:** Escape text for safe literal insertion into a JavaScript regular expression.
- **Why it is reusable:** `escapeRegexpString` is general-purpose and currently protects Select filtering from metacharacters. Mazey 5.6.9 has HTML escaping but no regular-expression escaping utility.
- **Proposed API:**

  ```ts
  function escapeRegExp(value: string): string;
  ```

  Use the standard JavaScript metacharacter set, preserve empty strings, avoid changing flags, and require callers to opt into any non-string coercion.

## 8. `walkTree`

- **Purpose:** Traverse nested collections while reporting structural context.
- **Why it is reusable:** Table's `walkTreeNode` contains framework-independent traversal used for tree-state normalization. A complete visitor contract would also serve menus, file trees, category data, and AST-like structures.
- **Proposed API:**

  ```ts
  function walkTree<T>(
    roots: readonly T[],
    visitor: (context: {
      node: T;
      parent: T | null;
      depth: number;
      index: number;
      path: readonly number[];
    }) => void | "skip" | "stop",
    options?: {
      getChildren?: (node: T) => readonly T[] | null | undefined;
    }
  ): void;
  ```

  Visit every node consistently and define subtree skipping, early termination, empty input, and cycle handling.

## Reviewed overlaps not recommended

- `merge` and object-tag checks already delegate to Mazey's `assignDefined` and `isPureObject`.
- DOM class helpers, type predicates, debounce/throttle, case conversion, date formatting, browser detection, and storage helpers already overlap with Mazey APIs or intentionally retain different legacy semantics.
- `stripScript`, `stripStyle`, and `stripTemplate` are duplicated between the documentation runtime and Markdown loader, but their regular expressions do not safely parse Vue single-file components with attributes or embedded tag-like text. Consolidate them locally or use the existing Vue compiler instead of promoting the current implementation.
- `looseEqual`, `arrayEquals`, `isEmpty`, table sorting, and date-picker utilities encode component-specific coercion or comparison rules and should not become general helpers without a separately specified contract.
