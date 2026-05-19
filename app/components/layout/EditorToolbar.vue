<template>
  <TooltipProvider>
    <div
      class="flex items-center justify-between px-4 sm:px-4 py-1 rounded-md bg-card dark:bg-card border border-border dark:border-border gap-1 sm:gap-2 overflow-x-auto shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] text-foreground">
      <!-- Always Visible Controls -->
      <div class="flex gap-1 shrink-0 items-center">
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
        <div class="h-6 w-px bg-muted dark:bg-muted mx-1"></div>

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

      <!-- Unified Responsive Main Toolbar -->
      <div class="flex flex-1 items-center gap-1 overflow-hidden">
        <div class="h-6 w-px bg-muted mx-1 hidden md:block"></div>

        <!-- Headings (hidden on mobile, visible on tablet+) -->
        <div class="hidden md:flex">
          <Popover>
            <PopoverTrigger as-child>
              <Button variant="ghost" size="sm" class="h-8 px-2 flex items-center justify-between w-16 shrink-0"
                title="Heading Styles" aria-label="Heading styles">
                <component :is="currentHeadingIcon" class="w-4 h-4 text-muted-foreground" />
                <ChevronDown class="w-3 h-3 text-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              class="w-40 p-2 bg-card dark:bg-card text-foreground-200 border border-border dark:border-border rounded-md shadow-lg">
              <div class="flex flex-col">
                <button
                  class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-accent dark:hover:bg-accent transition-colors"
                  @click="setHeading('p')">
                  <FileText class="w-4 h-4" />
                  Paragraph
                </button>
                <div class="border-t my-1 border-border dark:border-border" />
                <button v-for="h in [1,2,3,4,5,6]" :key="h"
                  class="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-accent dark:hover:bg-accent transition-colors"
                  @click="setHeading('h'+h)">
                  <component :is="h===1 ? Heading1 : h===2 ? Heading2 : h===3 ? Heading3 : h===4 ? Heading4 : h===5 ? Heading5 : Heading6" class="w-4 h-4" />
                  Heading {{h}}
                </button>
              </div>
            </PopoverContent>
          </Popover>
          <div class="h-6 w-px bg-muted dark:bg-muted mx-1 hidden lg:block"></div>
        </div>

        <!-- Zoom controls (Desktop only) -->
        <div class="hidden lg:flex items-center gap-1">
          <Tooltip><TooltipTrigger as-child><Button variant="ghost" size="sm" class="h-8 w-8 p-0 shrink-0" @click="changeZoom(-25)"><Minus class="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Zoom Out</p></TooltipContent></Tooltip>
          <Popover>
            <PopoverTrigger as-child>
              <button type="button" class="w-16 h-8 rounded flex items-center justify-center bg-transparent border-none p-0 focus:outline-none shrink-0"><Input type="number" v-model="zoomModel" class="w-16 text-center h-8 rounded bg-background border border-border text-foreground text-xs" /></button>
            </PopoverTrigger>
            <PopoverContent class="w-32 p-2 bg-card text-foreground border border-border rounded-md shadow-lg">
              <div class="flex flex-col">
                <button class="text-left px-2 py-1 rounded hover:bg-accent text-sm" @click="selectZoom('fit')">Fit</button>
                <div class="border-t my-1 border-border" />
                <button v-for="opt in zoomOptions" :key="opt" class="text-left px-2 py-1 rounded hover:bg-accent text-sm" @click="selectZoom(opt)">{{ opt }}%</button>
              </div>
            </PopoverContent>
          </Popover>
          <Tooltip><TooltipTrigger as-child><Button variant="ghost" size="sm" class="h-8 w-8 p-0 shrink-0" @click="changeZoom(25)"><Plus class="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Zoom In</p></TooltipContent></Tooltip>
          <div class="h-6 w-px bg-muted mx-1"></div>
        </div>

        <!-- Basic Formatting (Always visible) -->
        <div class="flex items-center gap-1 shrink-0">
          <Tooltip><TooltipTrigger as-child><Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-muted': active.bold }]" @click="$emit('format-bold')"><Bold class="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Bold</p></TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger as-child><Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-muted': active.italic }]" @click="$emit('format-italic')"><Italic class="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Italic</p></TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger as-child><Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-muted': active.underline }]" @click="$emit('format-underline')"><Underline class="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Underline</p></TooltipContent></Tooltip>
        </div>

        <!-- Strikethrough (Desktop only) -->
        <div class="hidden lg:flex items-center shrink-0">
          <Tooltip><TooltipTrigger as-child><Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-muted': active.strike }]" @click="$emit('format-strikethrough')"><Strikethrough class="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Strikethrough</p></TooltipContent></Tooltip>
        </div>

        <!-- Lists (Tablet+ only) -->
        <div class="hidden md:flex items-center gap-1 shrink-0">
          <div class="h-6 w-px bg-muted mx-1 hidden lg:block"></div>
          <Tooltip><TooltipTrigger as-child><Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-muted': active.bullet }]" @click="$emit('toggle-bullet-list')"><List class="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Bullet List</p></TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger as-child><Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-muted': active.ordered }]" @click="$emit('toggle-ordered-list')"><ListOrdered class="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Numbered List</p></TooltipContent></Tooltip>
        </div>

        <!-- More formatting (Desktop only) -->
        <div class="hidden lg:flex items-center gap-1 shrink-0">
          <div class="h-6 w-px bg-muted mx-1"></div>
          <Tooltip><TooltipTrigger as-child><Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('toggle-blockquote')"><Quote class="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Blockquote</p></TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger as-child><Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('insert-code-block')"><Code2 class="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Code Block</p></TooltipContent></Tooltip>
          
          <Popover>
            <PopoverTrigger as-child>
              <Button variant="ghost" size="sm" class="h-8 px-2 flex items-center justify-between w-16" title="Alignment">
                <component :is="alignmentIcon" class="w-4 h-4" />
                <ChevronDown class="w-3 h-3 text-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-36 p-2 bg-card text-foreground border border-border rounded-md shadow-lg">
              <div class="flex flex-col">
                <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent text-sm" @click="setAlign('left')"><AlignLeft class="w-4 h-4" />Left</button>
                <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent text-sm" @click="setAlign('center')"><AlignCenter class="w-4 h-4" />Center</button>
                <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent text-sm" @click="setAlign('right')"><AlignRight class="w-4 h-4" />Right</button>
                <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent text-sm" @click="setAlign('justify')"><AlignJustify class="w-4 h-4" />Justify</button>
              </div>
            </PopoverContent>
          </Popover>

          <Tooltip><TooltipTrigger as-child><Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('insert-link')"><Link class="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Link</p></TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger as-child><Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('insert-image')"><ImageIcon class="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Image</p></TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger as-child><Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="showTableDialog = true"><Table class="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Table</p></TooltipContent></Tooltip>
        </div>

        <div class="ml-auto flex items-center shrink-0">
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

      <!-- More Options Dropdown (Only on medium and small screens) -->
      <div class="flex lg:hidden gap-1 shrink-0 items-center">
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" aria-label="More options">
              <MoreHorizontal class="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            class="w-80 p-0 max-h-96 overflow-y-auto bg-card dark:bg-card text-foreground border border-border dark:border-border rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]"
            align="end">
            <div class="p-3 space-y-4">
              <!-- Text Styles Section -->
              <div class="space-y-2 md:hidden">
                <div
                  class="px-1 py-1 text-xs font-semibold text-foreground uppercase tracking-wide border-b border-border dark:border-border pb-2">
                  Text Styles</div>
                <Select @update:modelValue="handleHeadingChange">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select text style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">
                      <div class="flex items-center gap-2">
                        <FileText class="w-4 h-4 text-muted-foreground" />
                        <span>Paragraph</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="1">
                      <div class="flex items-center gap-2">
                        <Heading1 class="w-4 h-4 text-muted-foreground" />
                        <span>Heading 1</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="2">
                      <div class="flex items-center gap-2">
                        <Heading2 class="w-4 h-4 text-muted-foreground" />
                        <span>Heading 2</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="3">
                      <div class="flex items-center gap-2">
                        <Heading3 class="w-4 h-4 text-muted-foreground" />
                        <span>Heading 3</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="4">
                      <div class="flex items-center gap-2">
                        <Heading4 class="w-4 h-4 text-muted-foreground" />
                        <span>Heading 4</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="5">
                      <div class="flex items-center gap-2">
                        <Heading5 class="w-4 h-4 text-muted-foreground" />
                        <span>Heading 5</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="6">
                      <div class="flex items-center gap-2">
                        <Heading6 class="w-4 h-4 text-muted-foreground" />
                        <span>Heading 6</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Text Formatting Section -->
              <div class="space-y-2">
                <div
                  class="px-1 py-1 text-xs font-semibold text-foreground uppercase tracking-wide border-b border-border dark:border-border pb-2">
                  Text Format</div>
                <div class="grid grid-cols-2 gap-1">
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-accent transition-colors"
                    :class="{ 'bg-primary/20 text-primary font-medium': active.strike }"
                    @click="$emit('format-strikethrough')">
                    <Strikethrough class="w-4 h-4" />
                    <span class="text-sm">Strikethrough</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-accent transition-colors"
                    @click="$emit('format-superscript')">
                    <Superscript class="w-4 h-4 text-muted-foreground" />
                    <span class="text-sm">Superscript</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-accent transition-colors"
                    @click="$emit('format-subscript')">
                    <Subscript class="w-4 h-4 text-muted-foreground" />
                    <span class="text-sm">Subscript</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-accent transition-colors"
                    @click="$emit('toggle-blockquote')">
                    <Quote class="w-4 h-4 text-muted-foreground" />
                    <span class="text-sm">Quote</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-accent transition-colors col-span-2"
                    @click="$emit('insert-code-block')">
                    <Code2 class="w-4 h-4 text-muted-foreground" />
                    <span class="text-sm">Code Block</span>
                  </button>
                </div>
              </div>

              <!-- Colors Section -->
              <div class="space-y-3">
                <div
                  class="px-1 py-1 text-xs font-semibold text-foreground uppercase tracking-wide border-b border-border dark:border-border pb-2">
                  Colors</div>

                <!-- Text Color -->
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <Type class="w-4 h-4 text-muted-foreground" />
                    <span class="text-sm font-medium text-foreground">Text Color</span>
                  </div>
                  <div class="grid grid-cols-4 gap-2">
                    <button v-for="c in textColors" :key="c" :title="c"
                      class="relative w-full aspect-square rounded-lg border border-border/40 hover:scale-105 transition-all flex items-center justify-center cursor-pointer group"
                      :class="{ 'ring-2 ring-primary ring-offset-1 ring-offset-background': c === currentTextColor }" :style="{ backgroundColor: c }"
                      @click="$emit('set-text-color', c)">
                      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg"></div>
                      <Check v-if="c === currentTextColor"
                        :class="isLightColor(c) ? 'w-4 h-4 text-black' : 'w-4 h-4 text-white'" />
                    </button>
                  </div>
                  <div class="flex items-center gap-2 mt-2">
                    <div class="relative w-8 h-8 rounded-lg overflow-hidden border border-border/40 shrink-0">
                      <input type="color"
                        class="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
                        @input="onCustomTextColor" :value="currentTextColor" />
                    </div>
                    <input type="text"
                      class="flex-1 text-xs h-8 px-2 border rounded-lg bg-background border-border/40 text-foreground font-mono uppercase focus:ring-1 focus:ring-primary focus:outline-none"
                      placeholder="#RRGG" :value="currentTextColor" @change="onCustomTextColorText" />
                  </div>
                </div>

                <!-- Highlight Color -->
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <Highlighter class="w-4 h-4 text-muted-foreground" />
                    <span class="text-sm font-medium text-foreground">Highlight</span>
                  </div>
                  <div class="grid grid-cols-4 gap-2">
                    <button v-for="c in highlightColors" :key="c" :title="c"
                      class="relative w-full aspect-square rounded-lg border border-border/40 hover:scale-105 transition-all flex items-center justify-center cursor-pointer group"
                      :class="{ 
                        'ring-2 ring-primary ring-offset-1 ring-offset-background': c === currentHighlight,
                        'bg-[url(\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PGxpbmUgeDE9IjAiIHkxPSIxMCIgeDI9IjEwIiB5Mj0iMCIgc3Ryb2tlPSIjZmYwMDAwIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=\')] bg-center bg-no-repeat bg-white dark:bg-black': c === 'transparent'
                      }" 
                      :style="{ backgroundColor: c !== 'transparent' ? c : undefined }"
                      @click="$emit('set-highlight', c)">
                      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg"></div>
                      <Check v-if="c === currentHighlight"
                        :class="(c === 'transparent' || isLightColor(c)) ? 'w-4 h-4 text-black drop-shadow-md' : 'w-4 h-4 text-white drop-shadow-md'" />
                    </button>
                  </div>
                  <div class="flex items-center gap-2 mt-2">
                    <div class="relative w-8 h-8 rounded-lg overflow-hidden border border-border/40 shrink-0">
                      <input type="color"
                        class="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
                        @input="onCustomHighlight" :value="currentHighlight !== 'transparent' ? currentHighlight : '#ffffff'" />
                    </div>
                    <input type="text"
                      class="flex-1 text-xs h-8 px-2 border rounded-lg bg-background border-border/40 text-foreground font-mono uppercase focus:ring-1 focus:ring-primary focus:outline-none"
                      placeholder="#RRGG" :value="currentHighlight" @change="onCustomHighlightText" />
                  </div>
                </div>
              </div>

              <!-- Lists & Layout Section -->
              <div class="space-y-2">
                <div
                  class="px-1 py-1 text-xs font-semibold text-foreground uppercase tracking-wide border-b border-border dark:border-border pb-2">
                  Lists & Layout</div>
                <div class="grid grid-cols-2 gap-1">
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-accent transition-colors md:hidden"
                    :class="{ 'bg-primary/20 text-primary font-medium': active.bullet }" @click="$emit('toggle-bullet-list')">
                    <List class="w-4 h-4" />
                    <span class="text-sm">Bullet List</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-accent transition-colors md:hidden"
                    :class="{ 'bg-primary/20 text-primary font-medium': active.ordered }" @click="$emit('toggle-ordered-list')">
                    <ListOrdered class="w-4 h-4" />
                    <span class="text-sm">Numbered</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-accent transition-colors"
                    @click="$emit('indent')">
                    <Indent class="w-4 h-4 text-muted-foreground" />
                    <span class="text-sm">Indent</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-accent transition-colors"
                    @click="$emit('unindent')">
                    <Outdent class="w-4 h-4 text-muted-foreground" />
                    <span class="text-sm">Unindent</span>
                  </button>
                </div>

                <!-- Alignment -->
                <div class="space-y-2 mt-3">
                  <div class="text-xs font-medium text-muted-foreground">Alignment</div>
                  <div class="grid grid-cols-4 gap-1">
                    <button class="flex items-center justify-center p-2 rounded-md hover:bg-accent transition-colors"
                      @click="setAlign('left')">
                      <AlignLeft class="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button class="flex items-center justify-center p-2 rounded-md hover:bg-accent transition-colors"
                      @click="setAlign('center')">
                      <AlignCenter class="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button class="flex items-center justify-center p-2 rounded-md hover:bg-accent transition-colors"
                      @click="setAlign('right')">
                      <AlignRight class="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button class="flex items-center justify-center p-2 rounded-md hover:bg-accent transition-colors"
                      @click="setAlign('justify')">
                      <AlignJustify class="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Insert Elements Section -->
              <div class="space-y-2">
                <div
                  class="px-1 py-1 text-xs font-semibold text-foreground uppercase tracking-wide border-b border-border dark:border-border pb-2">
                  Insert</div>
                <div class="grid grid-cols-2 gap-1">
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-accent transition-colors"
                    @click="$emit('insert-link')">
                    <Link class="w-4 h-4 text-muted-foreground" />
                    <span class="text-sm">Link</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-accent transition-colors"
                    @click="$emit('insert-image')">
                    <ImageIcon class="w-4 h-4 text-muted-foreground" />
                    <span class="text-sm">Image</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-accent transition-colors"
                    @click="showTableDialog = true">
                    <Table class="w-4 h-4 text-muted-foreground" />
                    <span class="text-sm">Table</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-accent transition-colors"
                    @click="$emit('insert-horizontal-line')">
                    <Minus class="w-4 h-4 text-muted-foreground" />
                    <span class="text-sm">Divider</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-accent transition-colors"
                    @click="$emit('insert-math')">
                    <Sigma class="w-4 h-4 text-muted-foreground" />
                    <span class="text-sm">Math</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-accent transition-colors"
                    @click="$emit('insert-mathblock')">
                    <SquareSigma class="w-4 h-4 text-muted-foreground" />
                    <span class="text-sm">Math Block</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-accent transition-colors"
                    @click="$emit('insert-footnote')">
                    <FootnoteIcon class="w-4 h-4 text-muted-foreground" />
                    <span class="text-sm">Footnote</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-accent transition-colors"
                    @click="showEmojiDialog = true">
                    <Smile class="w-4 h-4 text-muted-foreground" />
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

  const textColors = ['#141413', '#333333', '#666666', '#b0aea5', '#d97757', '#c25a3a', '#6a9bcc', '#4a7fb5']
  const highlightColors = ['transparent', '#e8e6dc', '#d6e4f2', '#fcdfc6', '#b0aea5', '#333333', '#141413']
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
