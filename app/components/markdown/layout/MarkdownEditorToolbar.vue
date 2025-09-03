<template>
  <TooltipProvider>
    <div
      class="flex items-center justify-between px-4 sm:px-4 py-1 rounded-xl bg-white border border-gray-200 gap-1 sm:gap-2 overflow-x-auto shadow-sm">
      <!-- Always Visible Controls -->
      <div class="flex gap-1 flex-shrink-0 items-center">
        <!-- Mode label + toggle (farthest left) -->
        <div class="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="toggleMode"
                :title="mode === 'source' ? 'Switch to Reader' : 'Switch to Source'">
                <BookOpen v-if="mode === 'source'" class="w-4 h-4" />
                <Edit v-else class="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ mode === 'source' ? 'Switch to Reader View' : 'Switch to Source View' }}</p>
            </TooltipContent>
          </Tooltip>
          <div class="h-6 w-px bg-gray-300 mx-1"></div>
        </div>

        <!-- View Controls -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" @click="$emit('toggle-find')" class="h-8 w-8 p-0">
              <Search class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Find in Document</p>
          </TooltipContent>
        </Tooltip>

        <div class="h-6 w-px bg-gray-300 mx-1"></div>

        <!-- Undo/Redo -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" @click="$emit('undo')" :disabled="!canUndo" class="h-8 w-8 p-0">
              <Undo2 class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" @click="$emit('redo')" :disabled="!canRedo" class="h-8 w-8 p-0">
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
        <div class="h-6 w-px bg-gray-300 mx-1"></div>

        <!-- Headings (popover dropdown) -->
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 px-2 flex items-center justify-between w-16"
              title="Heading Styles">
              <component :is="currentHeadingIcon" class="w-4 h-4 text-gray-600" />
              <ChevronDown class="w-3 h-3 text-gray-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-40 p-2">
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

        <div class="h-6 w-px bg-gray-300 mx-1"></div>

        <!-- Zoom controls -->
        <div class="flex items-center gap-1 ml-1">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="changeZoom(-25)">
                <Minus class="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>

          <Popover>
            <PopoverTrigger as-child>
              <div>
                <Input type="number" v-model="zoomModel" class="w-20 text-center h-8 rounded" />
              </div>
            </PopoverTrigger>
            <PopoverContent class="w-32 p-2">
              <div class="flex flex-col">
                <button class="text-left px-2 py-1 rounded hover:bg-gray-100 font-medium"
                  @click="selectZoom('fit')">Fit</button>
                <div class="border-t my-1" />
                <button v-for="opt in zoomOptions" :key="opt" class="text-left px-2 py-1 rounded hover:bg-gray-100"
                  @click="selectZoom(opt)">{{ opt }}%</button>
              </div>
            </PopoverContent>
          </Popover>

          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="changeZoom(25)">
                <Plus class="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div class="h-6 w-px bg-gray-300 mx-1"></div>

        <!-- Basic Formatting -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.bold }]"
              @click="$emit('format-bold')">
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
              @click="$emit('format-italic')">
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
              @click="$emit('format-underline')">
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
              @click="$emit('format-strikethrough')">
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
                <div class="absolute bottom-0 left-0 w-full h-1 rounded" :style="{ backgroundColor: currentTextColor }"></div>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-64 p-3">
            <div class="grid grid-cols-8 gap-2">
              <button v-for="c in textColors" :key="c" :title="c"
                class="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform flex items-center justify-center cursor-pointer"
                :class="{ 'ring-2 ring-offset-1 ring-indigo-500': c === currentTextColor }"
                :style="{ backgroundColor: c }" @click="$emit('set-text-color', c)">
                <Check v-if="c === currentTextColor" :class="isLightColor(c) ? 'w-3 h-3 text-black' : 'w-3 h-3 text-white'" />
              </button>
            </div>
            <div class="mt-3 border-t pt-3">
              <div class="text-xs text-gray-500 mb-2">Custom color</div>
              <div class="flex items-center gap-2">
                <input type="color" class="w-10 h-8 p-0 border rounded cursor-pointer" @input="onCustomTextColor" />
                <input type="text" class="w-full text-sm h-8 px-2 border rounded" placeholder="#rrggbb" @change="onCustomTextColorText" />
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
                <div class="absolute bottom-0 left-0 w-full h-1 rounded" :style="{ backgroundColor: currentHighlight }"></div>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-56 p-3">
            <div class="grid grid-cols-8 gap-1">
              <Button v-for="c in highlightColors" :key="c" :title="c"
                class="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform flex items-center justify-center "
                :class="{ 'ring-2 ring-offset-1 ring-indigo-500': c === currentHighlight }"
                :style="{ backgroundColor: c }" @click="$emit('set-highlight', c)">
                <Check v-if="c === currentHighlight" :class="isLightColor(c) ? 'w-3 h-3 text-black' : 'w-3 h-3 text-white'" />
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <!-- Code Block -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('insert-code-block')">
              <Code2 class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Code Block</p>
          </TooltipContent>
        </Tooltip>

        <!-- Superscript -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('format-superscript')">
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
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('format-subscript')">
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
              title="Text Alignment">
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
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('insert-math')">
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
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('insert-mathblock')">
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
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('insert-horizontal-line')">
              <Minus class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Horizontal Line</p>
          </TooltipContent>
        </Tooltip>

        <!-- Footnote -->
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" title="Highlight" aria-label="Highlight">
              <div class="relative flex items-center justify-center">
                <Highlighter class="w-4 h-4" />
                <div class="absolute bottom-0 left-0 w-full h-1 rounded" :style="{ backgroundColor: currentHighlight }"></div>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-64 p-3">
            <div class="grid grid-cols-8 gap-2">
              <button v-for="c in highlightColors" :key="c" :title="c"
                class="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform flex items-center justify-center cursor-pointer"
                :class="{ 'ring-2 ring-offset-1 ring-indigo-500': c === currentHighlight }"
                :style="{ backgroundColor: c }" @click="$emit('set-highlight', c)">
                <Check v-if="c === currentHighlight" :class="isLightColor(c) ? 'w-3 h-3 text-black' : 'w-3 h-3 text-white'" />
              </button>
            </div>
            <div class="mt-3 border-t pt-3">
              <div class="text-xs text-gray-500 mb-2">Custom highlight</div>
              <div class="flex items-center gap-2">
                <input type="color" class="w-10 h-8 p-0 border rounded cursor-pointer" @input="onCustomHighlight" />
                <input type="text" class="w-full text-sm h-8 px-2 border rounded" placeholder="#rrggbb" @change="onCustomHighlightText" />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.bullet }]"
              @click="$emit('toggle-bullet-list')">
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
              @click="$emit('toggle-ordered-list')">
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
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('unindent')">
              <Outdent class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Unindent</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('indent')">
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
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('insert-link')">
              <Link class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Link</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('insert-image')">
              <ImageIcon class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Image</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="showTableDialog = true">
              <Table class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Table</p>
          </TooltipContent>
        </Tooltip>

        <!-- (mode toggle removed here; labeled control exists at far left) -->
      </div>

      <!-- Medium screens: Show essential formatting -->
      <div class="hidden md:flex lg:hidden gap-1 flex-1 items-center">
        <div class="h-6 w-px bg-gray-300 mx-1"></div>

        <!-- Headings (smaller popover) -->
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 px-2 flex items-center justify-between w-16">
              <component :is="currentHeadingIcon" class="w-4 h-4 text-gray-600" />
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
          @click="$emit('format-bold')">
          <Bold class="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.italic }]"
          @click="$emit('format-italic')">
          <Italic class="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.underline }]"
          @click="$emit('format-underline')">
          <Underline class="w-4 h-4" />
        </Button>

        <div class="h-6 w-px bg-gray-300 mx-1"></div>

        <!-- Lists -->
        <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.bullet }]"
          @click="$emit('toggle-bullet-list')">
          <List class="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.ordered }]"
          @click="$emit('toggle-ordered-list')">
          <ListOrdered class="w-4 h-4" />
        </Button>

        <!-- (mode toggle removed for medium screens; use far-left labeled control) -->
      </div>

      <!-- Small screens: Show minimal controls -->
      <div class="flex md:hidden gap-1 flex-1 items-center">
        <div class="h-6 w-px bg-gray-300 mx-1"></div>

        <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.bold }]"
          @click="$emit('format-bold')">
          <Bold class="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.italic }]"
          @click="$emit('format-italic')">
          <Italic class="w-4 h-4" />
        </Button>

        <div class="h-6 w-px bg-gray-300 mx-1"></div>

        <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': active.bullet }]"
          @click="$emit('toggle-bullet-list')">
          <List class="w-4 h-4" />
        </Button>

        <!-- (mode toggle removed for small screens; use far-left labeled control) -->
      </div>

      <!-- More Options Dropdown (Only on medium and small screens) -->
      <div class="flex lg:hidden gap-1 flex-shrink-0 items-center">
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
              <MoreHorizontal class="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-64 p-2" align="end">
            <div class="space-y-1">
              <!-- Paragraph Styles -->
              <div class="space-y-1">
                <div class="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">Style</div>
                <div>
                  <div class="flex flex-col">
                    <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                      @click="$emit('set-heading', 0)">
                      <FileText class="w-4 h-4" />
                      Paragraph
                    </button>
                    <div class="border-t my-1"></div>
                    <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                      @click="$emit('set-heading', 1)">
                      <Heading1 class="w-4 h-4" />
                      Heading 1
                    </button>
                    <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                      @click="$emit('set-heading', 2)">
                      <Heading2 class="w-4 h-4" />
                      Heading 2
                    </button>
                    <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                      @click="$emit('set-heading', 3)">
                      <Heading3 class="w-4 h-4" />
                      Heading 3
                    </button>
                    <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                      @click="$emit('set-heading', 4)">
                      <Heading4 class="w-4 h-4" />
                      Heading 4
                    </button>
                    <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                      @click="$emit('set-heading', 5)">
                      <Heading5 class="w-4 h-4" />
                      Heading 5
                    </button>
                    <button class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100"
                      @click="$emit('set-heading', 6)">
                      <Heading6 class="w-4 h-4" />
                      Heading 6
                    </button>
                  </div>
                </div>
                <div class="border-t border-gray-200 my-2"></div>
              </div>

              <!-- Formatting Controls (hidden on medium+ screens) -->
              <div class="md:hidden space-y-1">
                <div class="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">Format</div>
                <div class="grid grid-cols-4 gap-1">
                  <Button variant="ghost" size="sm" :class="['h-8', { 'bg-gray-100': active.underline }]"
                    @click="$emit('format-underline')">
                    <Underline class="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" :class="['h-8', { 'bg-gray-100': active.strike }]"
                    @click="$emit('format-strikethrough')">
                    <Strikethrough class="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" class="h-8" @click="$emit('insert-link')">
                    <Link class="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" class="h-8" @click="$emit('insert-image')">
                    <ImageIcon class="w-4 h-4" />
                  </Button>
                </div>
                <div class="border-t border-gray-200 my-2"></div>
              </div>

              <!-- Color controls -->
              <div class="space-y-1">
                <div class="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">Colors</div>
                <div class="grid grid-cols-8 gap-1">
                  <button v-for="c in textColors.slice(0, 8)" :key="c"
                    class="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                    :style="{ backgroundColor: c }" @click="$emit('set-text-color', c)"></button>
                </div>
                <div class="grid grid-cols-8 gap-1 mt-1">
                  <button v-for="c in highlightColors.slice(0, 8)" :key="c"
                    class="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                    :style="{ backgroundColor: c }" @click="$emit('set-highlight', c)"></button>
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
  import TableInsertDialog from '@/components/editor/TableInsertDialog.vue'
  import EmojiInsertDialog from '@/components/editor/EmojiInsertDialog.vue'
  import { Bold, Italic, Underline, Strikethrough, Type, Highlighter, Undo2, Redo2, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link, Image as ImageIcon, Code2, Table, Minus, Plus, Search, MoreHorizontal, BookOpen, Edit, Heading, ChevronDown, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, FileText, Quote, Indent, Outdent, Superscript, Subscript, Sigma, SquareSigma, Smile, FileText as FootnoteIcon, Check } from 'lucide-vue-next'

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
    'toggle-find', 'toggle-menubar',
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
