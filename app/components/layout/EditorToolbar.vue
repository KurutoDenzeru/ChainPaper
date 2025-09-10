<template>
  <TooltipProvider>
    <div
      class="flex items-center justify-between px-4 sm:px-4 py-1 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 gap-1 sm:gap-2 overflow-x-auto shadow-sm text-gray-700 dark:text-gray-200">
      <!-- Always Visible Controls -->
      <div class="flex gap-1 flex-shrink-0 items-center">
        <!-- Mode label + toggle (farthest left) -->
        <div class="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="toggleMode"
                :title="mode === 'source' ? 'Switch to Reader' : 'Switch to Source'"
                :aria-label="mode === 'source' ? 'Switch to Reader view' : 'Switch to Source view'"
                :aria-pressed="mode === 'source'">
                <BookOpen v-if="mode === 'source'" class="w-4 h-4" aria-hidden="true" />
                <Edit v-else class="w-4 h-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ mode === 'source' ? 'Switch to Reader View' : 'Switch to Source View' }}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <!-- View Controls -->
  <div class="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <!-- Undo/Redo -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" @click="$emit('undo')" :disabled="!canUndo" class="h-8 w-8 p-0"
              aria-label="Undo">
              <Undo2 class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" @click="$emit('redo')" :disabled="!canRedo" class="h-8 w-8 p-0"
              aria-label="Redo">
              <Redo2 class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <!-- Desktop Layout: Show all controls on large screens -->
      <div class="hidden lg:flex gap-1 flex-1 items-center">
  <div class="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <!-- Headings (popover dropdown) -->
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 px-2 flex items-center justify-between w-16"
              title="Heading Styles" aria-label="Heading styles">
              <component :is="currentHeadingIcon" class="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <ChevronDown class="w-3 h-3 text-gray-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-40 p-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
            <div class="flex flex-col">
              <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                @click="setHeading('p')">
                <FileText class="w-4 h-4" />
                Paragraph
              </button>
              <div class="border-t my-1" />
              <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                @click="setHeading('h1')">
                <Heading1 class="w-4 h-4" />
                Heading 1
              </button>
              <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                @click="setHeading('h2')">
                <Heading2 class="w-4 h-4" />
                Heading 2
              </button>
              <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                @click="setHeading('h3')">
                <Heading3 class="w-4 h-4" />
                Heading 3
              </button>
              <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                @click="setHeading('h4')">
                <Heading4 class="w-4 h-4" />
                Heading 4
              </button>
              <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                @click="setHeading('h5')">
                <Heading5 class="w-4 h-4" />
                Heading 5
              </button>
              <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                @click="setHeading('h6')">
                <Heading6 class="w-4 h-4" />
                Heading 6
              </button>
            </div>
          </PopoverContent>
        </Popover>

  <div class="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <!-- Zoom controls -->
        <div class="flex items-center gap-1 ml-1">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="changeZoom(-25)" aria-label="Zoom out">
                <Minus class="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>

          <Popover>
            <PopoverTrigger as-child>
              <button type="button" aria-haspopup="dialog" :aria-expanded="false"
                class="w-20 h-8 rounded flex items-center justify-center bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                tabindex="0">
                <span class="sr-only" id="editor-zoom-label">Zoom percentage</span>
                <Input id="editor-zoom-input" type="number" v-model="zoomModel" class="w-20 text-center h-8 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100"
                  aria-labelledby="editor-zoom-label" aria-label="Zoom percentage" role="spinbutton" aria-valuemin="50"
                  aria-valuemax="200" :aria-valuenow="isFit ? 100 : zoomPercent" />
              </button>
            </PopoverTrigger>
            <PopoverContent class="w-32 p-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
              <div class="flex flex-col">
                <button class="text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium"
                  @click="selectZoom('fit')">Fit</button>
                <div class="border-t my-1 border-gray-100 dark:border-gray-700" />
                <button v-for="opt in zoomOptions" :key="opt" class="text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"
                  @click="selectZoom(opt)">{{ opt }}%</button>
              </div>
            </PopoverContent>
          </Popover>

          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="changeZoom(25)" aria-label="Zoom in">
                <Plus class="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>
        </div>

  <div class="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <!-- Basic Formatting -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.bold }]"
              @click="$emit('format-bold')" :aria-pressed="active.bold" aria-label="Bold">
              <Bold class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bold</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.italic }]"
              @click="$emit('format-italic')" :aria-pressed="active.italic" aria-label="Italic">
              <Italic class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Italic</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.underline }]"
              @click="$emit('format-underline')" :aria-pressed="active.underline" aria-label="Underline">
              <Underline class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Underline</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.strike }]"
              @click="$emit('format-strikethrough')" :aria-pressed="active.strike" aria-label="Strikethrough">
              <Strikethrough class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Strikethrough</p>
          </TooltipContent>
        </Tooltip>

        <!-- Text Color -->
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" title="Text Color" aria-label="Text Color">
              <div class="relative flex items-center justify-center">
                <Type class="w-4 h-4" />
                <div class="absolute bottom-0 left-0 w-full h-1 rounded" :style="{ backgroundColor: currentTextColor }">
                </div>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-64 p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
            <div class="grid grid-cols-8 gap-2">
              <button v-for="c in textColors" :key="c" :title="c"
                class="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform flex items-center justify-center cursor-pointer"
                :class="{ 'ring-2 ring-offset-1 ring-indigo-500': c === currentTextColor }"
                :style="{ backgroundColor: c }" @click="$emit('set-text-color', c)">
                <Check v-if="c === currentTextColor"
                  :class="isLightColor(c) ? 'w-3 h-3 text-black' : 'w-3 h-3 text-white'" />
              </button>
            </div>
            <div class="mt-3 border-t pt-3">
              <div class="text-xs text-gray-500 mb-2">Custom color</div>
              <div class="flex items-center gap-2">
                <input type="color" class="w-10 h-8 p-0 border rounded cursor-pointer border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700" @input="onCustomTextColor" />
                <input type="text" class="w-full text-sm h-8 px-2 border rounded bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100" placeholder="#rrggbb"
                  @change="onCustomTextColorText" />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <!-- Highlight -->
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" title="Highlight" aria-label="Highlight">
              <div class="relative flex items-center justify-center">
                <Highlighter class="w-4 h-4" />
                <div class="absolute bottom-0 left-0 w-full h-1 rounded" :style="{ backgroundColor: currentHighlight }">
                </div>
              </div>
            </Button>
          </PopoverTrigger>
            <PopoverContent class="w-64 p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
            <div class="grid grid-cols-8 gap-2">
              <button v-for="c in highlightColors" :key="c" :title="c"
                class="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform flex items-center justify-center cursor-pointer"
                :class="{ 'ring-2 ring-offset-1 ring-indigo-500': c === currentHighlight }"
                :style="{ backgroundColor: c }" @click="$emit('set-highlight', c)">
                <Check v-if="c === currentHighlight"
                  :class="isLightColor(c) ? 'w-3 h-3 text-black' : 'w-3 h-3 text-white'" />
              </button>
            </div>
            <div class="mt-3 border-t pt-3">
              <div class="text-xs text-gray-500 mb-2">Custom highlight</div>
              <div class="flex items-center gap-2">
                <input type="color" class="w-10 h-8 p-0 border rounded cursor-pointer border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700" @input="onCustomHighlight" />
                <input type="text" class="w-full text-sm h-8 px-2 border rounded bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100" placeholder="#rrggbb"
                  @change="onCustomHighlightText" />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <!-- Code Block -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('insert-code-block')"
              aria-label="Insert code block">
              <Code2 class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Code Block</p>
          </TooltipContent>
        </Tooltip>

        <!-- Blockquote -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('toggle-blockquote')"
              aria-label="Toggle blockquote">
              <Quote class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Blockquote</p>
          </TooltipContent>
        </Tooltip>

        <!-- Superscript -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('format-superscript')"
              aria-label="Superscript">
              <Superscript class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Superscript</p>
          </TooltipContent>
        </Tooltip>

        <!-- Subscript -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('format-subscript')"
              aria-label="Subscript">
              <Subscript class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Subscript</p>
          </TooltipContent>
        </Tooltip>

        <div class="h-6 w-px bg-gray-300 mx-1"></div>

        <!-- Alignment (popover with chevron inside trigger) -->
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 px-2 flex items-center justify-between w-16"
              title="Text Alignment" aria-label="Text alignment">
              <component :is="alignmentIcon" class="w-4 h-4" />
              <ChevronDown class="w-3 h-3 text-gray-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-36 p-2">
            <div class="flex flex-col">
              <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100" @click="setAlign('left')">
                <AlignLeft class="w-4 h-4" />Left
              </button>
              <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100" @click="setAlign('center')">
                <AlignCenter class="w-4 h-4" />Center
              </button>
              <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100" @click="setAlign('right')">
                <AlignRight class="w-4 h-4" />Right
              </button>
              <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100" @click="setAlign('justify')">
                <AlignJustify class="w-4 h-4" />Justify
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <div class="h-6 w-px bg-gray-300 mx-1"></div>

        <!-- Math -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('insert-math')"
              aria-label="Insert inline math">
              <Sigma class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Math</p>
          </TooltipContent>
        </Tooltip>

        <!-- Mathblock -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('insert-mathblock')"
              aria-label="Insert math block">
              <SquareSigma class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Math Block</p>
          </TooltipContent>
        </Tooltip>

        <!-- Horizontal Line -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('insert-horizontal-line')"
              aria-label="Insert horizontal line">
              <Minus class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Horizontal Line</p>
          </TooltipContent>
        </Tooltip>

        <!-- Footnote -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('insert-footnote')"
              aria-label="Insert footnote">
              <FileText class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Footnote</p>
          </TooltipContent>
        </Tooltip>

        <!-- Emoji -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="showEmojiDialog = true"
              aria-label="Insert emoji">
              <Smile class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Emoji</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.bullet }]"
              @click="$emit('toggle-bullet-list')" :aria-pressed="active.bullet" aria-label="Toggle bullet list">
              <List class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bullet List</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.ordered }]"
              @click="$emit('toggle-ordered-list')" :aria-pressed="active.ordered" aria-label="Toggle numbered list">
              <ListOrdered class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Numbered List</p>
          </TooltipContent>
        </Tooltip>

        <!-- Indent/Unindent -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('unindent')" aria-label="Unindent">
              <Outdent class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Unindent</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('indent')" aria-label="Indent">
              <Indent class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Indent</p>
          </TooltipContent>
        </Tooltip>

        <div class="h-6 w-px bg-gray-300 mx-1"></div>

        <!-- Insert Tools -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('insert-link')"
              aria-label="Insert link">
              <Link class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Link</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('insert-image')"
              aria-label="Insert image">
              <ImageIcon class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Image</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="showTableDialog = true"
              aria-label="Insert table">
              <Table class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Table</p>
          </TooltipContent>
        </Tooltip>

        <!-- (mode toggle removed here; labeled control exists at far left) -->

        <!-- Collapse/Expand Menubar Button (at the end) -->
        <div class="ml-auto flex items-center">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="toggleMenubarCollapse"
                :aria-label="menubarCollapsed ? 'Expand Menu Bar' : 'Collapse Menu Bar'">
                <ChevronDown v-if="menubarCollapsed" class="w-4 h-4" />
                <ChevronUp v-else class="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>{{ menubarCollapsed ? 'Expand Menu Bar' : 'Collapse Menu Bar' }}</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <!-- Medium screens: Show essential formatting -->
      <div class="hidden md:flex lg:hidden gap-1 flex-1 items-center">
        <div class="h-6 w-px bg-gray-300 mx-1"></div>

        <!-- Headings (smaller popover) -->
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 px-2 flex items-center justify-between w-16">
              <component :is="currentHeadingIcon" class="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <ChevronDown class="w-3 h-3 text-gray-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-36 p-2">
            <div class="flex flex-col">
              <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                @click="setHeading('p')">
                <FileText class="w-4 h-4" />
                P
              </button>
              <div class="border-t my-1" />
              <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                @click="setHeading('h1')">
                <Heading1 class="w-4 h-4" />
                H1
              </button>
              <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                @click="setHeading('h2')">
                <Heading2 class="w-4 h-4" />
                H2
              </button>
              <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                @click="setHeading('h3')">
                <Heading3 class="w-4 h-4" />
                H3
              </button>
              <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                @click="setHeading('h4')">
                <Heading4 class="w-4 h-4" />
                H4
              </button>
              <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                @click="setHeading('h5')">
                <Heading5 class="w-4 h-4" />
                H5
              </button>
              <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                @click="setHeading('h6')">
                <Heading6 class="w-4 h-4" />
                H6
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <div class="h-6 w-px bg-gray-300 mx-1"></div>

        <!-- Basic Formatting -->
        <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.bold }]"
          @click="$emit('format-bold')" :aria-pressed="active.bold" aria-label="Bold">
          <Bold class="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.italic }]"
          @click="$emit('format-italic')" :aria-pressed="active.italic" aria-label="Italic">
          <Italic class="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.underline }]"
          @click="$emit('format-underline')" :aria-pressed="active.underline" aria-label="Underline">
          <Underline class="w-4 h-4" />
        </Button>

        <div class="h-6 w-px bg-gray-300 mx-1"></div>

        <!-- Lists -->
        <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.bullet }]"
          @click="$emit('toggle-bullet-list')" :aria-pressed="active.bullet" aria-label="Toggle bullet list">
          <List class="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.ordered }]"
          @click="$emit('toggle-ordered-list')" :aria-pressed="active.ordered" aria-label="Toggle numbered list">
          <ListOrdered class="w-4 h-4" />
        </Button>

        <!-- (mode toggle removed for medium screens; use far-left labeled control) -->
      </div>

      <!-- Small screens: Show only Bold, Italic, Underline -->
      <div class="flex md:hidden gap-1 flex-1 items-center">
        <div class="h-6 w-px bg-gray-300 mx-1"></div>

        <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.bold }]"
          @click="$emit('format-bold')" aria-label="Bold" :aria-pressed="active.bold">
          <Bold class="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.italic }]"
          @click="$emit('format-italic')" aria-label="Italic" :aria-pressed="active.italic">
          <Italic class="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.underline }]"
          @click="$emit('format-underline')" aria-label="Underline" :aria-pressed="active.underline">
          <Underline class="w-4 h-4" />
        </Button>

        <!-- Everything else goes to More Options dropdown -->
      </div>

      <!-- More Options Dropdown (Only on medium and small screens) -->
      <div class="flex lg:hidden gap-1 flex-shrink-0 items-center">
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" aria-label="More options">
              <MoreHorizontal class="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-80 p-0 max-h-96 overflow-y-auto" align="end">
            <div class="p-3 space-y-4">
              <!-- Text Styles Section -->
              <div class="space-y-2">
                <div
                  class="px-1 py-1 text-xs font-semibold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
                  Text Styles</div>
                <Select @update:modelValue="handleHeadingChange">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select text style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">
                      <div class="flex items-center gap-2">
                        <FileText class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        <span>Paragraph</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="1">
                      <div class="flex items-center gap-2">
                        <Heading1 class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        <span>Heading 1</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="2">
                      <div class="flex items-center gap-2">
                        <Heading2 class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        <span>Heading 2</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="3">
                      <div class="flex items-center gap-2">
                        <Heading3 class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        <span>Heading 3</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="4">
                      <div class="flex items-center gap-2">
                        <Heading4 class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        <span>Heading 4</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="5">
                      <div class="flex items-center gap-2">
                        <Heading5 class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        <span>Heading 5</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="6">
                      <div class="flex items-center gap-2">
                        <Heading6 class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        <span>Heading 6</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Text Formatting Section -->
              <div class="space-y-2">
                <div
                  class="px-1 py-1 text-xs font-semibold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
                  Text Format</div>
                <div class="grid grid-cols-2 gap-1">
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    :class="{ 'bg-blue-50 text-blue-700': active.strike }" @click="$emit('format-strikethrough')">
                    <Strikethrough class="w-4 h-4" />
                    <span class="text-sm">Strikethrough</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    @click="$emit('format-superscript')">
                    <Superscript class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span class="text-sm">Superscript</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    @click="$emit('format-subscript')">
                    <Subscript class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span class="text-sm">Subscript</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    @click="$emit('toggle-blockquote')">
                    <Quote class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span class="text-sm">Quote</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-gray-100 transition-colors col-span-2"
                    @click="$emit('insert-code-block')">
                    <Code2 class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span class="text-sm">Code Block</span>
                  </button>
                </div>
              </div>

              <!-- Colors Section -->
              <div class="space-y-3">
                <div
                  class="px-1 py-1 text-xs font-semibold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
                  Colors</div>

                <!-- Text Color -->
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <Type class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span class="text-sm font-medium text-gray-700">Text Color</span>
                  </div>
                  <div class="grid grid-cols-8 gap-1.5">
                    <button v-for="c in textColors" :key="c" :title="c"
                      class="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform cursor-pointer shadow-sm"
                      :class="{ 'ring-2 ring-offset-1 ring-blue-500': c === currentTextColor }"
                      :style="{ backgroundColor: c }" @click="$emit('set-text-color', c)">
                      <Check v-if="c === currentTextColor"
                        :class="isLightColor(c) ? 'w-3 h-3 text-black' : 'w-3 h-3 text-white'" />
                    </button>
                  </div>
                  <div class="flex items-center gap-2 mt-2">
                    <input type="color" class="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                      @input="onCustomTextColor" />
                    <input type="text" class="flex-1 text-xs h-6 px-2 border border-gray-300 rounded"
                      placeholder="#rrggbb" @change="onCustomTextColorText" />
                  </div>
                </div>

                <!-- Highlight Color -->
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <Highlighter class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span class="text-sm font-medium text-gray-700">Highlight</span>
                  </div>
                  <div class="grid grid-cols-8 gap-1.5">
                    <button v-for="c in highlightColors" :key="c" :title="c"
                      class="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform cursor-pointer shadow-sm"
                      :class="{ 'ring-2 ring-offset-1 ring-blue-500': c === currentHighlight }"
                      :style="{ backgroundColor: c }" @click="$emit('set-highlight', c)">
                      <Check v-if="c === currentHighlight"
                        :class="isLightColor(c) ? 'w-3 h-3 text-black' : 'w-3 h-3 text-white'" />
                    </button>
                  </div>
                  <div class="flex items-center gap-2 mt-2">
                    <input type="color" class="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                      @input="onCustomHighlight" />
                    <input type="text" class="flex-1 text-xs h-6 px-2 border border-gray-300 rounded"
                      placeholder="#rrggbb" @change="onCustomHighlightText" />
                  </div>
                </div>
              </div>

              <!-- Lists & Layout Section -->
              <div class="space-y-2">
                <div
                  class="px-1 py-1 text-xs font-semibold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
                  Lists & Layout</div>
                <div class="grid grid-cols-2 gap-1">
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    :class="{ 'bg-blue-50 text-blue-700': active.bullet }" @click="$emit('toggle-bullet-list')">
                    <List class="w-4 h-4" />
                    <span class="text-sm">Bullet List</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    :class="{ 'bg-blue-50 text-blue-700': active.ordered }" @click="$emit('toggle-ordered-list')">
                    <ListOrdered class="w-4 h-4" />
                    <span class="text-sm">Numbered</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    @click="$emit('indent')">
                    <Indent class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span class="text-sm">Indent</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    @click="$emit('unindent')">
                    <Outdent class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span class="text-sm">Unindent</span>
                  </button>
                </div>

                <!-- Alignment -->
                <div class="space-y-2 mt-3">
                  <div class="text-xs font-medium text-gray-600 dark:text-gray-300">Alignment</div>
                  <div class="grid grid-cols-4 gap-1">
                    <button class="flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition-colors"
                      @click="setAlign('left')">
                      <AlignLeft class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <button class="flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition-colors"
                      @click="setAlign('center')">
                      <AlignCenter class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <button class="flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition-colors"
                      @click="setAlign('right')">
                      <AlignRight class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <button class="flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition-colors"
                      @click="setAlign('justify')">
                      <AlignJustify class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Insert Elements Section -->
              <div class="space-y-2">
                <div
                  class="px-1 py-1 text-xs font-semibold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
                  Insert</div>
                <div class="grid grid-cols-2 gap-1">
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    @click="$emit('insert-link')">
                    <Link class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span class="text-sm">Link</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    @click="$emit('insert-image')">
                    <ImageIcon class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span class="text-sm">Image</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    @click="showTableDialog = true">
                    <Table class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span class="text-sm">Table</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    @click="$emit('insert-horizontal-line')">
                    <Minus class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span class="text-sm">Divider</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    @click="$emit('insert-math')">
                    <Sigma class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span class="text-sm">Math</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    @click="$emit('insert-mathblock')">
                    <SquareSigma class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span class="text-sm">Math Block</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    @click="$emit('insert-footnote')">
                    <FootnoteIcon class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span class="text-sm">Footnote</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    @click="showEmojiDialog = true">
                    <Smile class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span class="text-sm">Emoji</span>
                  </button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  </TooltipProvider>

  <!-- Table Insert Dialog -->
  <TableInsertDialog :open="showTableDialog" @update:open="showTableDialog = $event"
    @insert-table="handleTableInsert" />

  <!-- Emoji Insert Dialog -->
  <EmojiInsertDialog :open="showEmojiDialog" @update:open="showEmojiDialog = $event"
    @insert-emoji="handleEmojiInsert" />
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
  import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
  import TableInsertDialog from '~/components/dialogs/TableInsertDialog.vue'
  import EmojiInsertDialog from '~/components/dialogs/EmojiInsertDialog.vue'
  import { Bold, Italic, Underline, Strikethrough, Type, Highlighter, Undo2, Redo2, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link, Image as ImageIcon, Code2, Table, Minus, Plus, MoreHorizontal, BookOpen, Edit, Heading, ChevronDown, ChevronUp, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, FileText, Quote, Indent, Outdent, Superscript, Subscript, Sigma, SquareSigma, Smile, FileText as FootnoteIcon, Check } from 'lucide-vue-next'
  // Menubar collapse state (persisted in localStorage)
  const menubarCollapsed = ref(false)
  onMounted(() => {
    try {
      const saved = localStorage.getItem('chainpaper_menubar_collapsed')
      menubarCollapsed.value = saved === 'true'
    } catch { }
  })
  watch(menubarCollapsed, v => {
    try {
      localStorage.setItem('chainpaper_menubar_collapsed', v ? 'true' : 'false')
    } catch { }
    emit('toggle-menubar', v)
  })

  function toggleMenubarCollapse() {
    menubarCollapsed.value = !menubarCollapsed.value
  }

  interface ActiveState { bold: boolean; italic: boolean; underline: boolean; strike: boolean; bullet: boolean; ordered: boolean }
  const props = defineProps<{
    active?: Partial<ActiveState>
    align?: string
    zoom?: number
    fitMode?: boolean
    canUndo?: boolean
    canRedo?: boolean
    textColor?: string
    highlight?: string
    mode?: 'source' | 'reader'
    isMenuVisible?: boolean
  }>()

  const emit = defineEmits([
    'toggle-menubar',
    'format-bold', 'format-italic', 'format-underline', 'format-strikethrough',
    'format-superscript', 'format-subscript',
    'toggle-bullet-list', 'toggle-ordered-list', 'toggle-blockquote',
    'indent', 'unindent',
    'insert-link', 'insert-image', 'insert-table', 'insert-code-block',
    'insert-math', 'insert-mathblock', 'insert-horizontal-line', 'insert-footnote', 'insert-emoji',
    'set-heading', 'set-alignment', 'undo', 'redo', 'set-zoom',
    'set-text-color', 'set-highlight', 'update:mode'
  ])

  const heading = ref('p')
  function onHeadingChange(v: unknown) {
    if (v == null) return
    const val = String(v)
    heading.value = val
    if (val === 'p') emit('set-heading', 0)
    else emit('set-heading', Number(val.replace('h', '')))
  }

  const headingLabel = computed(() => {
    const v = heading.value
    if (!v || v === 'p') return 'Paragraph'
    return v.toUpperCase().replace('H', 'Heading ')
  })

  const currentHeadingIcon = computed(() => {
    const v = heading.value
    switch (v) {
      case 'h1': return Heading1
      case 'h2': return Heading2
      case 'h3': return Heading3
      case 'h4': return Heading4
      case 'h5': return Heading5
      case 'h6': return Heading6
      default: return FileText // For paragraph
    }
  })

  function setHeading(v: string) {
    heading.value = v
    if (v === 'p') emit('set-heading', 0)
    else emit('set-heading', Number(String(v).replace('h', '')))
  }

  function setAlign(a: string) { emit('set-alignment', a) }

  function handleHeadingChange(value: any) {
    if (value !== null && value !== undefined) {
      const level = Number(value)
      emit('set-heading', level)
    }
  }

  const alignmentIcon = computed(() => props.align === 'center' ? AlignCenter : props.align === 'right' ? AlignRight : props.align === 'justify' ? AlignJustify : AlignLeft)

  const active = computed(() => ({
    bold: !!props.active?.bold,
    italic: !!props.active?.italic,
    underline: !!props.active?.underline,
    strike: !!props.active?.strike,
    bullet: !!props.active?.bullet,
    ordered: !!props.active?.ordered
  }))

  // zoom logic
  const zoomPercent = ref<number>(props.zoom ?? 100)
  const isFit = ref<boolean>(!!props.fitMode)
  watch(() => props.zoom, v => { if (typeof v === 'number') { isFit.value = false; zoomPercent.value = Math.round(v) } })
  watch(() => props.fitMode, v => { isFit.value = !!v })

  const zoomModel = computed<string | number>({
    get: () => isFit.value ? 100 : zoomPercent.value,
    set: (v) => { const n = Number(v); if (Number.isNaN(n)) return; isFit.value = false; zoomPercent.value = Math.min(200, Math.max(50, Math.round(n))); emit('set-zoom', zoomPercent.value) }
  })
  const zoomOptions = [50, 75, 100, 125, 150, 175, 200]
  function changeZoom(delta: number) { zoomPercent.value = Math.min(200, Math.max(50, zoomPercent.value + delta)); isFit.value = false; emit('set-zoom', zoomPercent.value) }
  function selectZoom(opt: number | 'fit') { if (opt === 'fit') { emit('set-zoom', 'fit'); return } zoomPercent.value = opt as number; isFit.value = false; emit('set-zoom', opt as number) }

  const canUndo = computed(() => !!props.canUndo)
  const canRedo = computed(() => !!props.canRedo)
  const mode = ref<'source' | 'reader'>(props.mode ?? 'source')
  watch(() => props.mode, v => { if (v) mode.value = v })
  function toggleMode() { mode.value = mode.value === 'source' ? 'reader' : 'source'; emit('update:mode', mode.value) }

  const textColors = ['#111827', '#374151', '#6B7280', '#9CA3AF', '#DC2626', '#EA580C', '#D97706', '#CA8A04', '#16A34A', '#0D9488', '#2563EB', '#9333EA', '#DB2777', '#F59E0B', '#10B981', '#3B82F6', '#6366F1']
  const highlightColors = ['#FEF3C7', '#FFEDD5', '#FFE4E6', '#F3E8FF', '#E0F2FE', '#DCFCE7', '#FEE2E2', '#E2E8F0', '#D1FAE5', '#FDE68A', '#FBCFE8', '#C7D2FE', '#E9D5FF', '#F5F3FF', '#FAE8FF', '#F1F5F9']
  const currentTextColor = computed(() => props.textColor || '#111827')
  const currentHighlight = computed(() => props.highlight || '#FDE68A')

  // helper: determine if color is light to choose check icon contrast
  function isLightColor(hex: string) {
    try {
      const s = String(hex).replace('#', '')
      const r = parseInt(s.substring(0, 2), 16)
      const g = parseInt(s.substring(2, 4), 16)
      const b = parseInt(s.substring(4, 6), 16)
      // perceptive luminance
      const lum = 0.299 * r + 0.587 * g + 0.114 * b
      return lum > 200
    } catch {
      return false
    }
  }

  // Dialog states
  const showTableDialog = ref(false)
  const showEmojiDialog = ref(false)

  // Table insertion handler
  function handleTableInsert(rows: number, cols: number, options: any) {
    emit('insert-table', rows, cols, options)
  }

  // Emoji insertion handler
  function handleEmojiInsert(emoji: any) {
    emit('insert-emoji', emoji.char)
  }

  // safe handlers for custom color inputs
  function onCustomTextColor(e: Event) {
    const t = e?.target as HTMLInputElement | null
    if (!t) return
    const v = String(t.value || '').trim()
    if (v) emit('set-text-color', v)
  }

  function onCustomTextColorText(e: Event) {
    const t = e?.target as HTMLInputElement | null
    if (!t) return
    const v = String(t.value || '').trim()
    if (v) emit('set-text-color', v)
  }

  function onCustomHighlight(e: Event) {
    const t = e?.target as HTMLInputElement | null
    if (!t) return
    const v = String(t.value || '').trim()
    if (v) emit('set-highlight', v)
  }

  function onCustomHighlightText(e: Event) {
    const t = e?.target as HTMLInputElement | null
    if (!t) return
    const v = String(t.value || '').trim()
    if (v) emit('set-highlight', v)
  }
</script>
