<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>😀 Insert Emoji</DialogTitle>
        <DialogDescription>
          Choose an emoji to insert into your document
        </DialogDescription>
      </DialogHeader>

      <div class="mt-4">
        <TooltipProvider>
          <Tabs v-model="activeTab" class="w-full">
            <TabsList class="grid w-full grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="recent">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span>🕒</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Recently used</p>
                  </TooltipContent>
                </Tooltip>
              </TabsTrigger>
              <TabsTrigger value="smileys">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span>😀</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Smileys & People</p>
                  </TooltipContent>
                </Tooltip>
              </TabsTrigger>
              <TabsTrigger value="animals">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span>🐶</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Animals & Nature</p>
                  </TooltipContent>
                </Tooltip>
              </TabsTrigger>
              <TabsTrigger value="food">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span>🍎</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Food & Drink</p>
                  </TooltipContent>
                </Tooltip>
              </TabsTrigger>
              <TabsTrigger value="activities">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span>⚽</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Activities & Sports</p>
                  </TooltipContent>
                </Tooltip>
              </TabsTrigger>
              <TabsTrigger value="travel">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span>🚗</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Travel & Places</p>
                  </TooltipContent>
                </Tooltip>
              </TabsTrigger>
              <TabsTrigger value="objects">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span>💡</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Objects & Symbols</p>
                  </TooltipContent>
                </Tooltip>
              </TabsTrigger>
              <TabsTrigger value="flags">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span>🏁</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Flags</p>
                  </TooltipContent>
                </Tooltip>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recent" class="mt-4">
              <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                <button v-for="emoji in recentEmojis" :key="emoji.char" @click="selectEmoji(emoji)"
                  class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer" :title="emoji.name">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span>{{ emoji.char }}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{{ emoji.name }}</p>
                    </TooltipContent>
                  </Tooltip>
                </button>
              </div>
              <div v-if="recentEmojis.length === 0" class="text-center text-gray-500 py-8">
                No recently used emojis
              </div>
            </TabsContent>

            <TabsContent value="smileys" class="mt-4">
              <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                <button v-for="emoji in smileyEmojis" :key="emoji.char" @click="selectEmoji(emoji)"
                  class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer" :title="emoji.name">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span>{{ emoji.char }}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{{ emoji.name }}</p>
                    </TooltipContent>
                  </Tooltip>
                </button>
              </div>
            </TabsContent>

            <TabsContent value="animals" class="mt-4">
              <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                <button v-for="emoji in animalEmojis" :key="emoji.char" @click="selectEmoji(emoji)"
                  class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer" :title="emoji.name">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span>{{ emoji.char }}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{{ emoji.name }}</p>
                    </TooltipContent>
                  </Tooltip>
                </button>
              </div>
            </TabsContent>

            <TabsContent value="food" class="mt-4">
              <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                <button v-for="emoji in foodEmojis" :key="emoji.char" @click="selectEmoji(emoji)"
                  class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer" :title="emoji.name">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span>{{ emoji.char }}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{{ emoji.name }}</p>
                    </TooltipContent>
                  </Tooltip>
                </button>
              </div>
            </TabsContent>

            <TabsContent value="activities" class="mt-4">
              <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                <button v-for="emoji in activityEmojis" :key="emoji.char" @click="selectEmoji(emoji)"
                  class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer" :title="emoji.name">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span>{{ emoji.char }}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{{ emoji.name }}</p>
                    </TooltipContent>
                  </Tooltip>
                </button>
              </div>
            </TabsContent>

            <TabsContent value="objects" class="mt-4">
              <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                <button v-for="emoji in objectEmojis" :key="emoji.char" @click="selectEmoji(emoji)"
                  class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer" :title="emoji.name">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span>{{ emoji.char }}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{{ emoji.name }}</p>
                    </TooltipContent>
                  </Tooltip>
                </button>
              </div>
            </TabsContent>
            
            <TabsContent value="travel" class="mt-4">
              <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                <button v-for="emoji in travelEmojis" :key="emoji.char" @click="selectEmoji(emoji)"
                  class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer" :title="emoji.name">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span>{{ emoji.char }}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{{ emoji.name }}</p>
                    </TooltipContent>
                  </Tooltip>
                </button>
              </div>
            </TabsContent>
            
            <TabsContent value="flags" class="mt-4">
              <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                <button v-for="emoji in flagEmojis" :key="emoji.char" @click="selectEmoji(emoji)"
                  class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer" :title="emoji.name">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span>{{ emoji.char }}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{{ emoji.name }}</p>
                    </TooltipContent>
                  </Tooltip>
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </TooltipProvider>
      </div>

      <DialogFooter>
        <Button variant="outline" class="w-full" @click="$emit('update:open', false)">
          Cancel
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
  import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

  interface Emoji {
    char: string
    name: string
    shortcode: string
  }

  const props = defineProps<{
    open: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
    (e: 'insert-emoji', emoji: Emoji): void
  }>()

  const activeTab = ref('recent')
  const recentEmojis = ref<Emoji[]>([])

  // Check if emoji is supported on the current OS
  function isEmojiSupported(emoji: string): boolean {
    if (typeof window === 'undefined') return false

    const canvas = document.createElement('canvas')
    canvas.width = 10
    canvas.height = 10
    const ctx = canvas.getContext('2d')
    if (!ctx) return false

    ctx.textBaseline = 'top'
    ctx.font = '8px Arial'
    ctx.fillText(emoji, 0, 0)

    return ctx.getImageData(0, 0, 10, 10).data.some(pixel => pixel !== 0)
  }

  // Filter emojis based on OS support
  function filterSupportedEmojis(emojis: Emoji[]): Emoji[] {
    return emojis.filter(emoji => isEmojiSupported(emoji.char))
  }

  // Emoji data - these are commonly supported across all platforms
  const smileyEmojis = ref<Emoji[]>([
    { char: '😀', name: 'Grinning Face', shortcode: ':grinning:' },
    { char: '😃', name: 'Grinning Face with Big Eyes', shortcode: ':smiley:' },
    { char: '😄', name: 'Grinning Face with Smiling Eyes', shortcode: ':smile:' },
    { char: '😁', name: 'Beaming Face with Smiling Eyes', shortcode: ':grin:' },
    { char: '😆', name: 'Grinning Squinting Face', shortcode: ':laughing:' },
    { char: '😅', name: 'Grinning Face with Sweat', shortcode: ':sweat_smile:' },
    { char: '🤣', name: 'Rolling on the Floor Laughing', shortcode: ':rofl:' },
    { char: '😂', name: 'Face with Tears of Joy', shortcode: ':joy:' },
    { char: '🙂', name: 'Slightly Smiling Face', shortcode: ':slightly_smiling_face:' },
    { char: '🙃', name: 'Upside-Down Face', shortcode: ':upside_down_face:' },
    { char: '😉', name: 'Winking Face', shortcode: ':wink:' },
    { char: '😊', name: 'Smiling Face with Smiling Eyes', shortcode: ':blush:' },
    { char: '😇', name: 'Smiling Face with Halo', shortcode: ':innocent:' },
    { char: '🥰', name: 'Smiling Face with Hearts', shortcode: ':smiling_face_with_hearts:' },
    { char: '😍', name: 'Smiling Face with Heart-Eyes', shortcode: ':heart_eyes:' },
    { char: '🤩', name: 'Star-Struck', shortcode: ':star_struck:' },
    { char: '😘', name: 'Face Blowing a Kiss', shortcode: ':kissing_heart:' },
    { char: '😗', name: 'Kissing Face', shortcode: ':kissing:' },
    { char: '😚', name: 'Kissing Face with Closed Eyes', shortcode: ':kissing_closed_eyes:' },
    { char: '😙', name: 'Kissing Face with Smiling Eyes', shortcode: ':kissing_smiling_eyes:' },
    { char: '🥲', name: 'Smiling Face with Tear', shortcode: ':smiling_face_with_tear:' },
    { char: '😋', name: 'Face Savoring Food', shortcode: ':yum:' },
    { char: '😛', name: 'Face with Tongue', shortcode: ':stuck_out_tongue:' },
    { char: '😜', name: 'Winking Face with Tongue', shortcode: ':stuck_out_tongue_winking_eye:' },
    { char: '🤪', name: 'Zany Face', shortcode: ':zany_face:' },
    { char: '😝', name: 'Squinting Face with Tongue', shortcode: ':stuck_out_tongue_closed_eyes:' },
    { char: '🤑', name: 'Money-Mouth Face', shortcode: ':money_mouth_face:' },
    { char: '🤗', name: 'Smiling Face with Open Hands', shortcode: ':hugs:' },
    { char: '🤭', name: 'Face with Hand Over Mouth', shortcode: ':hand_over_mouth:' },
    { char: '🫢', name: 'Face with Open Eyes and Hand Over Mouth', shortcode: ':face_with_open_eyes_and_hand_over_mouth:' },
    { char: '🫣', name: 'Face with Peeking Eye', shortcode: ':face_with_peeking_eye:' },
    { char: '🤫', name: 'Shushing Face', shortcode: ':shushing_face:' },
    { char: '🤔', name: 'Thinking Face', shortcode: ':thinking:' },
    { char: '🫡', name: 'Saluting Face', shortcode: ':saluting_face:' },
    { char: '🤐', name: 'Zipper-Mouth Face', shortcode: ':zipper_mouth_face:' },
    { char: '🤨', name: 'Face with Raised Eyebrow', shortcode: ':raised_eyebrow:' },
    { char: '😐', name: 'Neutral Face', shortcode: ':neutral_face:' },
    { char: '😑', name: 'Expressionless Face', shortcode: ':expressionless:' },
    { char: '😶', name: 'Face Without Mouth', shortcode: ':no_mouth:' },
    { char: '🫥', name: 'Dotted Line Face', shortcode: ':dotted_line_face:' },
    { char: '😶‍🌫️', name: 'Face in Clouds', shortcode: ':face_in_clouds:' },
    { char: '😏', name: 'Smirking Face', shortcode: ':smirk:' },
    { char: '😒', name: 'Unamused Face', shortcode: ':unamused:' },
    { char: '🙄', name: 'Face with Rolling Eyes', shortcode: ':roll_eyes:' },
    { char: '😬', name: 'Grimacing Face', shortcode: ':grimacing:' },
    { char: '😮‍💨', name: 'Face Exhaling', shortcode: ':face_exhaling:' },
    { char: '🤥', name: 'Lying Face', shortcode: ':lying_face:' },
    { char: '😌', name: 'Relieved Face', shortcode: ':relieved:' },
    { char: '😔', name: 'Pensive Face', shortcode: ':pensive:' },
    { char: '😪', name: 'Sleepy Face', shortcode: ':sleepy:' },
    { char: '🤤', name: 'Drooling Face', shortcode: ':drooling_face:' },
    { char: '😴', name: 'Sleeping Face', shortcode: ':sleeping:' },
  ])

  const animalEmojis = ref<Emoji[]>([
    { char: '🐶', name: 'Dog Face', shortcode: ':dog:' },
    { char: '🐱', name: 'Cat Face', shortcode: ':cat:' },
    { char: '🐭', name: 'Mouse Face', shortcode: ':mouse:' },
    { char: '🐹', name: 'Hamster', shortcode: ':hamster:' },
    { char: '🐰', name: 'Rabbit Face', shortcode: ':rabbit:' },
    { char: '🦊', name: 'Fox', shortcode: ':fox_face:' },
    { char: '🐻', name: 'Bear', shortcode: ':bear:' },
    { char: '🐼', name: 'Panda', shortcode: ':panda_face:' },
    { char: '🐨', name: 'Koala', shortcode: ':koala:' },
    { char: '🐯', name: 'Tiger Face', shortcode: ':tiger:' },
    { char: '🦁', name: 'Lion', shortcode: ':lion:' },
    { char: '🐮', name: 'Cow Face', shortcode: ':cow:' },
    { char: '🐷', name: 'Pig Face', shortcode: ':pig:' },
    { char: '🐽', name: 'Pig Nose', shortcode: ':pig_nose:' },
    { char: '🐸', name: 'Frog', shortcode: ':frog:' },
    { char: '🐵', name: 'Monkey Face', shortcode: ':monkey_face:' },
    { char: '🙈', name: 'See-No-Evil Monkey', shortcode: ':see_no_evil:' },
    { char: '🙉', name: 'Hear-No-Evil Monkey', shortcode: ':hear_no_evil:' },
    { char: '🙊', name: 'Speak-No-Evil Monkey', shortcode: ':speak_no_evil:' },
    { char: '🐒', name: 'Monkey', shortcode: ':monkey:' },
    { char: '🐔', name: 'Chicken', shortcode: ':chicken:' },
    { char: '🐧', name: 'Penguin', shortcode: ':penguin:' },
    { char: '🐦', name: 'Bird', shortcode: ':bird:' },
    { char: '🐤', name: 'Baby Chick', shortcode: ':baby_chick:' },
    { char: '🐣', name: 'Hatching Chick', shortcode: ':hatching_chick:' },
    { char: '🐥', name: 'Front-Facing Baby Chick', shortcode: ':hatched_chick:' },
    { char: '🦆', name: 'Duck', shortcode: ':duck:' },
    { char: '🦅', name: 'Eagle', shortcode: ':eagle:' },
    { char: '🦉', name: 'Owl', shortcode: ':owl:' },
    { char: '🦇', name: 'Bat', shortcode: ':bat:' },
    { char: '🐺', name: 'Wolf', shortcode: ':wolf:' },
    { char: '🐗', name: 'Boar', shortcode: ':boar:' },
    { char: '🐴', name: 'Horse Face', shortcode: ':horse:' },
    { char: '🦄', name: 'Unicorn', shortcode: ':unicorn:' },
    { char: '🐝', name: 'Honeybee', shortcode: ':bee:' },
    { char: '🪲', name: 'Beetle', shortcode: ':beetle:' },
    { char: '🦋', name: 'Butterfly', shortcode: ':butterfly:' },
    { char: '🐌', name: 'Snail', shortcode: ':snail:' },
    { char: '🐞', name: 'Lady Beetle', shortcode: ':ladybug:' },
    { char: '🐜', name: 'Ant', shortcode: ':ant:' },
    { char: '🪰', name: 'Fly', shortcode: ':fly:' },
    { char: '🪱', name: 'Worm', shortcode: ':worm:' },
    { char: '🦗', name: 'Cricket', shortcode: ':cricket:' },
    { char: '🕷️', name: 'Spider', shortcode: ':spider:' },
    { char: '🕸️', name: 'Spider Web', shortcode: ':spider_web:' },
    { char: '🦂', name: 'Scorpion', shortcode: ':scorpion:' },
    { char: '🐢', name: 'Turtle', shortcode: ':turtle:' },
    { char: '🐍', name: 'Snake', shortcode: ':snake:' },
    { char: '🦎', name: 'Lizard', shortcode: ':lizard:' },
    { char: '🦖', name: 'T-Rex', shortcode: ':t-rex:' },
    { char: '🦕', name: 'Sauropod', shortcode: ':sauropod:' },
  ])

  const foodEmojis = ref<Emoji[]>([
    { char: '🍎', name: 'Red Apple', shortcode: ':apple:' },
    { char: '🍏', name: 'Green Apple', shortcode: ':green_apple:' },
    { char: '🍊', name: 'Tangerine', shortcode: ':tangerine:' },
    { char: '🍋', name: 'Lemon', shortcode: ':lemon:' },
    { char: '🍌', name: 'Banana', shortcode: ':banana:' },
    { char: '🍉', name: 'Watermelon', shortcode: ':watermelon:' },
    { char: '🍇', name: 'Grapes', shortcode: ':grapes:' },
    { char: '🍓', name: 'Strawberry', shortcode: ':strawberry:' },
    { char: '🫐', name: 'Blueberries', shortcode: ':blueberries:' },
    { char: '🍈', name: 'Melon', shortcode: ':melon:' },
    { char: '🍒', name: 'Cherries', shortcode: ':cherries:' },
    { char: '🍑', name: 'Peach', shortcode: ':peach:' },
    { char: '🥭', name: 'Mango', shortcode: ':mango:' },
    { char: '🍍', name: 'Pineapple', shortcode: ':pineapple:' },
    { char: '🥥', name: 'Coconut', shortcode: ':coconut:' },
    { char: '🥝', name: 'Kiwi Fruit', shortcode: ':kiwi_fruit:' },
    { char: '🍅', name: 'Tomato', shortcode: ':tomato:' },
    { char: '🍆', name: 'Eggplant', shortcode: ':eggplant:' },
    { char: '🥑', name: 'Avocado', shortcode: ':avocado:' },
    { char: '🥦', name: 'Broccoli', shortcode: ':broccoli:' },
    { char: '🥬', name: 'Leafy Greens', shortcode: ':leafy_greens:' },
    { char: '🥒', name: 'Cucumber', shortcode: ':cucumber:' },
    { char: '🌶️', name: 'Hot Pepper', shortcode: ':hot_pepper:' },
    { char: '🫑', name: 'Bell Pepper', shortcode: ':bell_pepper:' },
    { char: '🌽', name: 'Ear of Corn', shortcode: ':corn:' },
    { char: '🥕', name: 'Carrot', shortcode: ':carrot:' },
    { char: '🫒', name: 'Olive', shortcode: ':olive:' },
    { char: '🧄', name: 'Garlic', shortcode: ':garlic:' },
    { char: '🧅', name: 'Onion', shortcode: ':onion:' },
    { char: '🥔', name: 'Potato', shortcode: ':potato:' },
    { char: '🍠', name: 'Roasted Sweet Potato', shortcode: ':sweet_potato:' },
    { char: '🥐', name: 'Croissant', shortcode: ':croissant:' },
    { char: '🥖', name: 'Baguette Bread', shortcode: ':baguette_bread:' },
    { char: '🍞', name: 'Bread', shortcode: ':bread:' },
    { char: '🥨', name: 'Pretzel', shortcode: ':pretzel:' },
    { char: '🥯', name: 'Bagel', shortcode: ':bagel:' },
    { char: '🥞', name: 'Pancakes', shortcode: ':pancakes:' },
    { char: '🧇', name: 'Waffle', shortcode: ':waffle:' },
    { char: '🧀', name: 'Cheese Wedge', shortcode: ':cheese:' },
    { char: '🍖', name: 'Meat on Bone', shortcode: ':meat_on_bone:' },
    { char: '🍗', name: 'Poultry Leg', shortcode: ':poultry_leg:' },
    { char: '🥩', name: 'Cut of Meat', shortcode: ':cut_of_meat:' },
    { char: '🥓', name: 'Bacon', shortcode: ':bacon:' },
    { char: '🍔', name: 'Hamburger', shortcode: ':hamburger:' },
    { char: '🍟', name: 'French Fries', shortcode: ':fries:' },
    { char: '🍕', name: 'Pizza', shortcode: ':pizza:' },
    { char: '🌭', name: 'Hot Dog', shortcode: ':hotdog:' },
    { char: '🥪', name: 'Sandwich', shortcode: ':sandwich:' },
    { char: '🌮', name: 'Taco', shortcode: ':taco:' },
    { char: '🌯', name: 'Burrito', shortcode: ':burrito:' },
  ])

  const activityEmojis = ref<Emoji[]>([
    { char: '⚽', name: 'Soccer Ball', shortcode: ':soccer:' },
    { char: '🏀', name: 'Basketball', shortcode: ':basketball:' },
    { char: '🏈', name: 'American Football', shortcode: ':football:' },
    { char: '⚾', name: 'Baseball', shortcode: ':baseball:' },
    { char: '🥎', name: 'Softball', shortcode: ':softball:' },
    { char: '🎾', name: 'Tennis', shortcode: ':tennis:' },
    { char: '🏐', name: 'Volleyball', shortcode: ':volleyball:' },
    { char: '🏉', name: 'Rugby Football', shortcode: ':rugby_football:' },
    { char: '🥏', name: 'Flying Disc', shortcode: ':flying_disc:' },
    { char: '🎱', name: 'Pool 8 Ball', shortcode: ':8ball:' },
    { char: '🪀', name: 'Yo-Yo', shortcode: ':yo_yo:' },
    { char: '🏓', name: 'Ping Pong', shortcode: ':ping_pong:' },
    { char: '🏸', name: 'Badminton', shortcode: ':badminton:' },
    { char: '🥅', name: 'Goal Net', shortcode: ':goal_net:' },
    { char: '⛳', name: 'Flag in Hole', shortcode: ':golf:' },
    { char: '🪁', name: 'Kite', shortcode: ':kite:' },
    { char: '🏹', name: 'Bow and Arrow', shortcode: ':bow_and_arrow:' },
    { char: '🎣', name: 'Fishing Pole', shortcode: ':fishing_pole_and_fish:' },
    { char: '🤿', name: 'Diving Mask', shortcode: ':diving_mask:' },
    { char: '🥊', name: 'Boxing Glove', shortcode: ':boxing_glove:' },
    { char: '🥋', name: 'Martial Arts Uniform', shortcode: ':martial_arts_uniform:' },
    { char: '🎽', name: 'Running Shirt', shortcode: ':running_shirt_with_sash:' },
    { char: '🛹', name: 'Skateboard', shortcode: ':skateboard:' },
    { char: '🛷', name: 'Sled', shortcode: ':sled:' },
    { char: '⛸️', name: 'Ice Skate', shortcode: ':ice_skate:' },
    { char: '🥌', name: 'Curling Stone', shortcode: ':curling_stone:' },
    { char: '🎿', name: 'Skis', shortcode: ':ski:' },
    { char: '⛷️', name: 'Skier', shortcode: ':skier:' },
    { char: '🏂', name: 'Snowboarder', shortcode: ':snowboarder:' },
    { char: '🪂', name: 'Parachute', shortcode: ':parachute:' },
    { char: '🏋️‍♀️', name: 'Woman Lifting Weights', shortcode: ':weight_lifting_woman:' },
    { char: '🏋️‍♂️', name: 'Man Lifting Weights', shortcode: ':weight_lifting_man:' },
    { char: '🤼‍♀️', name: 'Women Wrestling', shortcode: ':women_wrestling:' },
    { char: '🤼‍♂️', name: 'Men Wrestling', shortcode: ':men_wrestling:' },
    { char: '🤸‍♀️', name: 'Woman Cartwheeling', shortcode: ':woman_cartwheeling:' },
    { char: '🤸‍♂️', name: 'Man Cartwheeling', shortcode: ':man_cartwheeling:' },
    { char: '⛹️‍♀️', name: 'Woman Bouncing Ball', shortcode: ':woman_bouncing_ball:' },
    { char: '⛹️‍♂️', name: 'Man Bouncing Ball', shortcode: ':man_bouncing_ball:' },
    { char: '🤺', name: 'Person Fencing', shortcode: ':person_fencing:' },
    { char: '🤾‍♀️', name: 'Woman Playing Handball', shortcode: ':woman_playing_handball:' },
    { char: '🤾‍♂️', name: 'Man Playing Handball', shortcode: ':man_playing_handball:' },
    { char: '🏌️‍♀️', name: 'Woman Golfing', shortcode: ':woman_golfing:' },
    { char: '🏌️‍♂️', name: 'Man Golfing', shortcode: ':man_golfing:' },
    { char: '🏇', name: 'Horse Racing', shortcode: ':horse_racing:' },
    { char: '🧘‍♀️', name: 'Woman in Lotus Position', shortcode: ':woman_in_lotus_position:' },
    { char: '🧘‍♂️', name: 'Man in Lotus Position', shortcode: ':man_in_lotus_position:' },
    { char: '🏄‍♀️', name: 'Woman Surfing', shortcode: ':woman_surfing:' },
    { char: '🏄‍♂️', name: 'Man Surfing', shortcode: ':man_surfing:' },
    { char: '🏊‍♀️', name: 'Woman Swimming', shortcode: ':woman_swimming:' },
    { char: '🏊‍♂️', name: 'Man Swimming', shortcode: ':man_swimming:' },
  ])

  const objectEmojis = ref<Emoji[]>([
    { char: '💡', name: 'Light Bulb', shortcode: ':bulb:' },
    { char: '🔦', name: 'Flashlight', shortcode: ':flashlight:' },
    { char: '🕯️', name: 'Candle', shortcode: ':candle:' },
    { char: '🪔', name: 'Diya Lamp', shortcode: ':diya_lamp:' },
    { char: '🔥', name: 'Fire', shortcode: ':fire:' },
    { char: '🧯', name: 'Fire Extinguisher', shortcode: ':fire_extinguisher:' },
    { char: '🛢️', name: 'Oil Drum', shortcode: ':oil_drum:' },
    { char: '💸', name: 'Money with Wings', shortcode: ':money_with_wings:' },
    { char: '💵', name: 'Dollar Banknote', shortcode: ':dollar:' },
    { char: '💴', name: 'Yen Banknote', shortcode: ':yen:' },
    { char: '💶', name: 'Euro Banknote', shortcode: ':euro:' },
    { char: '💷', name: 'Pound Banknote', shortcode: ':pound:' },
    { char: '🪙', name: 'Coin', shortcode: ':coin:' },
    { char: '💰', name: 'Money Bag', shortcode: ':moneybag:' },
    { char: '💳', name: 'Credit Card', shortcode: ':credit_card:' },
    { char: '💎', name: 'Gem Stone', shortcode: ':gem:' },
    { char: '⚖️', name: 'Balance Scale', shortcode: ':balance_scale:' },
    { char: '🪜', name: 'Ladder', shortcode: ':ladder:' },
    { char: '🧰', name: 'Toolbox', shortcode: ':toolbox:' },
    { char: '🔧', name: 'Wrench', shortcode: ':wrench:' },
    { char: '🔨', name: 'Hammer', shortcode: ':hammer:' },
    { char: '⚒️', name: 'Hammer and Pick', shortcode: ':hammer_and_pick:' },
    { char: '🛠️', name: 'Hammer and Wrench', shortcode: ':hammer_and_wrench:' },
    { char: '⛏️', name: 'Pick', shortcode: ':pick:' },
    { char: '🪚', name: 'Carpentry Saw', shortcode: ':carpentry_saw:' },
    { char: '🔩', name: 'Nut and Bolt', shortcode: ':nut_and_bolt:' },
    { char: '⚙️', name: 'Gear', shortcode: ':gear:' },
    { char: '🪤', name: 'Mouse Trap', shortcode: ':mouse_trap:' },
    { char: '🧲', name: 'Magnet', shortcode: ':magnet:' },
    { char: '🪣', name: 'Bucket', shortcode: ':bucket:' },
    { char: '🔫', name: 'Water Pistol', shortcode: ':gun:' },
    { char: '🧨', name: 'Firecracker', shortcode: ':firecracker:' },
    { char: '🪓', name: 'Axe', shortcode: ':axe:' },
    { char: '🔪', name: 'Kitchen Knife', shortcode: ':hocho:' },
    { char: '🗡️', name: 'Dagger', shortcode: ':dagger:' },
    { char: '⚔️', name: 'Crossed Swords', shortcode: ':crossed_swords:' },
    { char: '🛡️', name: 'Shield', shortcode: ':shield:' },
    { char: '🚬', name: 'Cigarette', shortcode: ':smoking:' },
    { char: '⚰️', name: 'Coffin', shortcode: ':coffin:' },
    { char: '🪦', name: 'Headstone', shortcode: ':headstone:' },
    { char: '⚱️', name: 'Funeral Urn', shortcode: ':funeral_urn:' },
    { char: '🏺', name: 'Amphora', shortcode: ':amphora:' },
    { char: '🔮', name: 'Crystal Ball', shortcode: ':crystal_ball:' },
    { char: '📿', name: 'Prayer Beads', shortcode: ':prayer_beads:' },
    { char: '🧿', name: 'Nazar Amulet', shortcode: ':nazar_amulet:' },
    { char: '💈', name: 'Barber Pole', shortcode: ':barber:' },
    { char: '⚗️', name: 'Alembic', shortcode: ':alembic:' },
    { char: '🔭', name: 'Telescope', shortcode: ':telescope:' },
    { char: '🔬', name: 'Microscope', shortcode: ':microscope:' },
    { char: '💻', name: 'Laptop', shortcode: ':computer:' },
    { char: '⌨️', name: 'Keyboard', shortcode: ':keyboard:' },
    { char: '🖥️', name: 'Desktop Computer', shortcode: ':desktop_computer:' },
    { char: '🖨️', name: 'Printer', shortcode: ':printer:' },
    { char: '🖱️', name: 'Computer Mouse', shortcode: ':computer_mouse:' },
    { char: '📱', name: 'Mobile Phone', shortcode: ':iphone:' },
    { char: '☎️', name: 'Telephone', shortcode: ':phone:' },
    { char: '📞', name: 'Telephone Receiver', shortcode: ':telephone_receiver:' },
    { char: '📟', name: 'Pager', shortcode: ':pager:' },
    { char: '📠', name: 'Fax Machine', shortcode: ':fax:' },
    { char: '🔋', name: 'Battery', shortcode: ':battery:' },
    { char: '🪫', name: 'Low Battery', shortcode: ':low_battery:' },
    { char: '🔌', name: 'Electric Plug', shortcode: ':electric_plug:' },
    { char: '📸', name: 'Camera with Flash', shortcode: ':camera_flash:' },
    { char: '📷', name: 'Camera', shortcode: ':camera:' },
    { char: '📹', name: 'Video Camera', shortcode: ':video_camera:' },
    { char: '📼', name: 'Videocassette', shortcode: ':vhs:' },
    { char: '🔍', name: 'Magnifying Glass Tilted Left', shortcode: ':mag:' },
    { char: '🔎', name: 'Magnifying Glass Tilted Right', shortcode: ':mag_right:' },
    { char: '📡', name: 'Satellite Antenna', shortcode: ':satellite:' },
    { char: '🎙️', name: 'Studio Microphone', shortcode: ':studio_microphone:' },
    { char: '🎚️', name: 'Level Slider', shortcode: ':level_slider:' },
    { char: '🎛️', name: 'Control Knobs', shortcode: ':control_knobs:' },
    { char: '🧭', name: 'Compass', shortcode: ':compass:' },
    { char: '🎯', name: 'Direct Hit', shortcode: ':dart:' },
    { char: '🪃', name: 'Boomerang', shortcode: ':boomerang:' },
    { char: '🪄', name: 'Magic Wand', shortcode: ':magic_wand:' },
    { char: '🎮', name: 'Video Game', shortcode: ':video_game:' },
    { char: '🕹️', name: 'Joystick', shortcode: ':joystick:' },
    { char: '🎰', name: 'Slot Machine', shortcode: ':slot_machine:' },
    { char: '🎲', name: 'Game Die', shortcode: ':game_die:' },
    { char: '🧩', name: 'Puzzle Piece', shortcode: ':jigsaw:' },
    { char: '🧸', name: 'Teddy Bear', shortcode: ':teddy_bear:' },
    { char: '🪅', name: 'Piñata', shortcode: ':pinata:' },
    { char: '🪆', name: 'Nesting Dolls', shortcode: ':nesting_dolls:' },
    { char: '♠️', name: 'Spade Suit', shortcode: ':spades:' },
    { char: '♥️', name: 'Heart Suit', shortcode: ':hearts:' },
    { char: '♦️', name: 'Diamond Suit', shortcode: ':diamonds:' },
    { char: '♣️', name: 'Club Suit', shortcode: ':clubs:' },
    { char: '♟️', name: 'Chess Pawn', shortcode: ':chess_pawn:' },
    { char: '🃏', name: 'Joker', shortcode: ':black_joker:' },
    { char: '🎴', name: 'Flower Playing Cards', shortcode: ':flower_playing_cards:' },
    { char: '🎭', name: 'Performing Arts', shortcode: ':performing_arts:' },
    { char: '🖼️', name: 'Framed Picture', shortcode: ':framed_picture:' },
    { char: '🎨', name: 'Artist Palette', shortcode: ':art:' },
    { char: '🧵', name: 'Thread', shortcode: ':thread:' },
    { char: '🪡', name: 'Sewing Needle', shortcode: ':sewing_needle:' },
    { char: '🧶', name: 'Yarn', shortcode: ':yarn:' },
    { char: '🪢', name: 'Knot', shortcode: ':knot:' },
  ])

  const travelEmojis = ref<Emoji[]>([
    { char: '🚗', name: 'Car', shortcode: ':car:' },
    { char: '🚙', name: 'SUV', shortcode: ':suv:' },
    { char: '🚐', name: 'Minivan', shortcode: ':minivan:' },
    { char: '🚛', name: 'Delivery Truck', shortcode: ':truck:' },
    { char: '🚚', name: 'Articulated Lorry', shortcode: ':articulated_lorry:' },
    { char: '🚜', name: 'Tractor', shortcode: ':tractor:' },
    { char: '🏎️', name: 'Racing Car', shortcode: ':racing_car:' },
    { char: '🏍️', name: 'Motorcycle', shortcode: ':motorcycle:' },
    { char: '🛵', name: 'Motor Scooter', shortcode: ':motor_scooter:' },
    { char: '🚲', name: 'Bicycle', shortcode: ':bike:' },
    { char: '🛴', name: 'Kick Scooter', shortcode: ':kick_scooter:' },
    { char: '🛹', name: 'Skateboard', shortcode: ':skateboard:' },
    { char: '🛼', name: 'Roller Skate', shortcode: ':roller_skate:' },
    { char: '🚁', name: 'Helicopter', shortcode: ':helicopter:' },
    { char: '🛩️', name: 'Small Airplane', shortcode: ':small_airplane:' },
    { char: '✈️', name: 'Airplane', shortcode: ':airplane:' },
    { char: '🛫', name: 'Airplane Departure', shortcode: ':flight_departure:' },
    { char: '🛬', name: 'Airplane Arrival', shortcode: ':flight_arrival:' },
    { char: '🪂', name: 'Parachute', shortcode: ':parachute:' },
    { char: '💺', name: 'Seat', shortcode: ':seat:' },
    { char: '🚀', name: 'Rocket', shortcode: ':rocket:' },
    { char: '🛸', name: 'Flying Saucer', shortcode: ':flying_saucer:' },
    { char: '🚉', name: 'Station', shortcode: ':station:' },
    { char: '🚊', name: 'Tram', shortcode: ':tram:' },
    { char: '🚝', name: 'Monorail', shortcode: ':monorail:' },
    { char: '🚞', name: 'Mountain Railway', shortcode: ':mountain_railway:' },
    { char: '🚋', name: 'Tram Car', shortcode: ':train:' },
    { char: '🚃', name: 'Railway Car', shortcode: ':railway_car:' },
    { char: '🚎', name: 'Trolleybus', shortcode: ':trolleybus:' },
    { char: '🚌', name: 'Bus', shortcode: ':bus:' },
    { char: '🚍', name: 'Oncoming Bus', shortcode: ':oncoming_bus:' },
    { char: '🚘', name: 'Oncoming Automobile', shortcode: ':oncoming_automobile:' },
    { char: '🚖', name: 'Taxi', shortcode: ':taxi:' },
    { char: '🚕', name: 'Taxi', shortcode: ':taxi:' },
    { char: '🛺', name: 'Auto Rickshaw', shortcode: ':auto_rickshaw:' },
    { char: '🚓', name: 'Police Car', shortcode: ':police_car:' },
    { char: '🚔', name: 'Oncoming Police Car', shortcode: ':oncoming_police_car:' },
    { char: '🚑', name: 'Ambulance', shortcode: ':ambulance:' },
    { char: '🚒', name: 'Fire Engine', shortcode: ':fire_engine:' },
    { char: '🛻', name: 'Pickup Truck', shortcode: ':pickup_truck:' },
    { char: '🏗️', name: 'Building Construction', shortcode: ':building_construction:' },
    { char: '🏭', name: 'Factory', shortcode: ':factory:' },
    { char: '🏘️', name: 'Houses', shortcode: ':houses:' },
    { char: '🏚️', name: 'Derelict House', shortcode: ':derelict_house:' },
    { char: '🏠', name: 'House', shortcode: ':house:' },
    { char: '🏡', name: 'House with Garden', shortcode: ':house_with_garden:' },
    { char: '🏢', name: 'Office Building', shortcode: ':office:' },
    { char: '🏣', name: 'Japanese Post Office', shortcode: ':post_office:' },
    { char: '🏤', name: 'Post Office', shortcode: ':european_post_office:' },
    { char: '🏥', name: 'Hospital', shortcode: ':hospital:' },
    { char: '🏦', name: 'Bank', shortcode: ':bank:' },
    { char: '🏨', name: 'Hotel', shortcode: ':hotel:' },
    { char: '🏩', name: 'Love Hotel', shortcode: ':love_hotel:' },
    { char: '🏪', name: 'Convenience Store', shortcode: ':convenience_store:' },
    { char: '🏫', name: 'School', shortcode: ':school:' },
    { char: '🏬', name: 'Department Store', shortcode: ':department_store:' },
    { char: '🏯', name: 'Japanese Castle', shortcode: ':japanese_castle:' },
    { char: '🏰', name: 'Castle', shortcode: ':european_castle:' },
    { char: '💒', name: 'Wedding', shortcode: ':wedding:' },
    { char: '🗼', name: 'Tokyo Tower', shortcode: ':tokyo_tower:' },
    { char: '🗽', name: 'Statue of Liberty', shortcode: ':statue_of_liberty:' },
    { char: '⛪', name: 'Church', shortcode: ':church:' },
    { char: '🕌', name: 'Mosque', shortcode: ':mosque:' },
    { char: '🛕', name: 'Hindu Temple', shortcode: ':hindu_temple:' },
    { char: '🕍', name: 'Synagogue', shortcode: ':synagogue:' },
    { char: '⛩️', name: 'Shinto Shrine', shortcode: ':shinto_shrine:' },
    { char: '🕋', name: 'Kaaba', shortcode: ':kaaba:' },
    { char: '⛲', name: 'Fountain', shortcode: ':fountain:' },
    { char: '⛺', name: 'Tent', shortcode: ':tent:' },
    { char: '🌁', name: 'Foggy', shortcode: ':foggy:' },
    { char: '🌃', name: 'Night with Stars', shortcode: ':night_with_stars:' },
    { char: '🏙️', name: 'Cityscape', shortcode: ':cityscape:' },
    { char: '🌄', name: 'Sunrise Over Mountains', shortcode: ':sunrise_over_mountains:' },
    { char: '🌅', name: 'Sunrise', shortcode: ':sunrise:' },
    { char: '🌆', name: 'Cityscape at Dusk', shortcode: ':city_sunset:' },
    { char: '🌇', name: 'Sunset', shortcode: ':city_sunrise:' },
    { char: '🌉', name: 'Bridge at Night', shortcode: ':bridge_at_night:' },
    { char: '🎠', name: 'Carousel Horse', shortcode: ':carousel_horse:' },
    { char: '🎡', name: 'Ferris Wheel', shortcode: ':ferris_wheel:' },
    { char: '🎢', name: 'Roller Coaster', shortcode: ':roller_coaster:' },
    { char: '🚂', name: 'Locomotive', shortcode: ':steam_locomotive:' },
    { char: '🚆', name: 'Train', shortcode: ':train2:' },
    { char: '🚄', name: 'High-Speed Train', shortcode: ':bullettrain_side:' },
    { char: '🚅', name: 'Bullet Train', shortcode: ':bullettrain_front:' },
    { char: '🚈', name: 'Light Rail', shortcode: ':light_rail:' },
    { char: '🚝', name: 'Monorail', shortcode: ':monorail:' },
    { char: '🚞', name: 'Mountain Railway', shortcode: ':mountain_railway:' },
    { char: '🚟', name: 'Suspension Railway', shortcode: ':suspension_railway:' },
    { char: '🚠', name: 'Mountain Cableway', shortcode: ':mountain_cableway:' },
    { char: '🚡', name: 'Aerial Tramway', shortcode: ':aerial_tramway:' },
    { char: '🛫', name: 'Airplane Departure', shortcode: ':flight_departure:' },
    { char: '🛬', name: 'Airplane Arrival', shortcode: ':flight_arrival:' },
    { char: '🛥️', name: 'Motor Boat', shortcode: ':motor_boat:' },
    { char: '🚤', name: 'Speedboat', shortcode: ':speedboat:' },
    { char: '🛳️', name: 'Passenger Ship', shortcode: ':passenger_ship:' },
    { char: '⛴️', name: 'Ferry', shortcode: ':ferry:' },
    { char: '🚢', name: 'Ship', shortcode: ':ship:' },
    { char: '⚓', name: 'Anchor', shortcode: ':anchor:' },
    { char: '🪝', name: 'Hook', shortcode: ':hook:' },
    { char: '⛽', name: 'Fuel Pump', shortcode: ':fuelpump:' },
    { char: '🚧', name: 'Construction', shortcode: ':construction:' },
    { char: '🚨', name: 'Police Car Light', shortcode: ':rotating_light:' },
    { char: '🚥', name: 'Horizontal Traffic Light', shortcode: ':traffic_light:' },
    { char: '🚦', name: 'Vertical Traffic Light', shortcode: ':vertical_traffic_light:' },
    { char: '🛑', name: 'Stop Sign', shortcode: ':stop_sign:' },
    { char: '🚏', name: 'Bus Stop', shortcode: ':busstop:' },
    { char: '🗺️', name: 'World Map', shortcode: ':world_map:' },
    { char: '🗿', name: 'Moai', shortcode: ':moyai:' },
    { char: '🗻', name: 'Mount Fuji', shortcode: ':mount_fuji:' },
    { char: '🏔️', name: 'Snow-Capped Mountain', shortcode: ':mountain_snow:' },
    { char: '⛰️', name: 'Mountain', shortcode: ':mountain:' },
    { char: '🌋', name: 'Volcano', shortcode: ':volcano:' },
    { char: '🏕️', name: 'Camping', shortcode: ':camping:' },
    { char: '🏖️', name: 'Beach with Umbrella', shortcode: ':beach_umbrella:' },
    { char: '🏜️', name: 'Desert', shortcode: ':desert:' },
    { char: '🏝️', name: 'Desert Island', shortcode: ':desert_island:' },
    { char: '🏞️', name: 'National Park', shortcode: ':national_park:' },
  ])

  const flagEmojis = ref<Emoji[]>([
    { char: '🏁', name: 'Chequered Flag', shortcode: ':checkered_flag:' },
    { char: '🚩', name: 'Triangular Flag', shortcode: ':triangular_flag_on_post:' },
    { char: '🎌', name: 'Crossed Flags', shortcode: ':crossed_flags:' },
    { char: '🏴', name: 'Black Flag', shortcode: ':black_flag:' },
    { char: '🏳️', name: 'White Flag', shortcode: ':white_flag:' },
    { char: '🏳️‍🌈', name: 'Rainbow Flag', shortcode: ':rainbow_flag:' },
    { char: '🏳️‍⚧️', name: 'Transgender Flag', shortcode: ':transgender_flag:' },
    { char: '🏴‍☠️', name: 'Pirate Flag', shortcode: ':pirate_flag:' },
    { char: '🇺🇸', name: 'United States Flag', shortcode: ':us:' },
    { char: '🇬🇧', name: 'United Kingdom Flag', shortcode: ':gb:' },
    { char: '🇨🇦', name: 'Canada Flag', shortcode: ':canada:' },
    { char: '🇫🇷', name: 'France Flag', shortcode: ':fr:' },
    { char: '🇩🇪', name: 'Germany Flag', shortcode: ':de:' },
    { char: '🇮🇹', name: 'Italy Flag', shortcode: ':it:' },
    { char: '🇪🇸', name: 'Spain Flag', shortcode: ':es:' },
    { char: '🇯🇵', name: 'Japan Flag', shortcode: ':jp:' },
    { char: '🇨🇳', name: 'China Flag', shortcode: ':cn:' },
    { char: '🇰🇷', name: 'South Korea Flag', shortcode: ':kr:' },
    { char: '🇷🇺', name: 'Russia Flag', shortcode: ':ru:' },
    { char: '🇧🇷', name: 'Brazil Flag', shortcode: ':brazil:' },
    { char: '🇦🇺', name: 'Australia Flag', shortcode: ':australia:' },
    { char: '🇮🇳', name: 'India Flag', shortcode: ':india:' },
    { char: '🇲🇽', name: 'Mexico Flag', shortcode: ':mexico:' },
    { char: '🇳🇱', name: 'Netherlands Flag', shortcode: ':netherlands:' },
    { char: '🇸🇪', name: 'Sweden Flag', shortcode: ':sweden:' },
    { char: '🇳🇴', name: 'Norway Flag', shortcode: ':norway:' },
    { char: '🇩🇰', name: 'Denmark Flag', shortcode: ':denmark:' },
    { char: '🇫🇮', name: 'Finland Flag', shortcode: ':finland:' },
    { char: '🇨🇭', name: 'Switzerland Flag', shortcode: ':switzerland:' },
    { char: '🇦🇹', name: 'Austria Flag', shortcode: ':austria:' },
    { char: '🇧🇪', name: 'Belgium Flag', shortcode: ':belgium:' },
    { char: '🇵🇹', name: 'Portugal Flag', shortcode: ':portugal:' },
    { char: '🇬🇷', name: 'Greece Flag', shortcode: ':greece:' },
    { char: '🇹🇷', name: 'Turkey Flag', shortcode: ':tr:' },
    { char: '🇪🇬', name: 'Egypt Flag', shortcode: ':egypt:' },
    { char: '🇿🇦', name: 'South Africa Flag', shortcode: ':south_africa:' },
    { char: '🇳🇬', name: 'Nigeria Flag', shortcode: ':nigeria:' },
    { char: '🇰🇪', name: 'Kenya Flag', shortcode: ':kenya:' },
    { char: '🇲🇦', name: 'Morocco Flag', shortcode: ':morocco:' },
    { char: '🇪🇹', name: 'Ethiopia Flag', shortcode: ':ethiopia:' },
    { char: '🇬🇭', name: 'Ghana Flag', shortcode: ':ghana:' },
    { char: '🇺🇬', name: 'Uganda Flag', shortcode: ':uganda:' },
    { char: '🇹🇿', name: 'Tanzania Flag', shortcode: ':tanzania:' },
    { char: '🇿🇼', name: 'Zimbabwe Flag', shortcode: ':zimbabwe:' },
    { char: '🇦🇷', name: 'Argentina Flag', shortcode: ':argentina:' },
    { char: '🇨🇱', name: 'Chile Flag', shortcode: ':chile:' },
    { char: '🇨🇴', name: 'Colombia Flag', shortcode: ':colombia:' },
    { char: '🇵🇪', name: 'Peru Flag', shortcode: ':peru:' },
    { char: '🇻🇪', name: 'Venezuela Flag', shortcode: ':venezuela:' },
    { char: '🇪🇨', name: 'Ecuador Flag', shortcode: ':ecuador:' },
    { char: '🇺🇾', name: 'Uruguay Flag', shortcode: ':uruguay:' },
    { char: '🇵🇾', name: 'Paraguay Flag', shortcode: ':paraguay:' },
    { char: '🇧🇴', name: 'Bolivia Flag', shortcode: ':bolivia:' },
    { char: '🇬🇾', name: 'Guyana Flag', shortcode: ':guyana:' },
    { char: '🇸🇷', name: 'Suriname Flag', shortcode: ':suriname:' },
    { char: '🇦🇩', name: 'Andorra Flag', shortcode: ':andorra:' },
    { char: '🇦🇪', name: 'United Arab Emirates Flag', shortcode: ':united_arab_emirates:' },
    { char: '🇦🇫', name: 'Afghanistan Flag', shortcode: ':afghanistan:' },
    { char: '🇦🇬', name: 'Antigua Barbuda Flag', shortcode: ':antigua_barbuda:' },
    { char: '🇦🇮', name: 'Anguilla Flag', shortcode: ':anguilla:' },
    { char: '🇦🇱', name: 'Albania Flag', shortcode: ':albania:' },
    { char: '🇦🇲', name: 'Armenia Flag', shortcode: ':armenia:' },
    { char: '🇦🇴', name: 'Angola Flag', shortcode: ':angola:' },
    { char: '🇦🇶', name: 'Antarctica Flag', shortcode: ':antarctica:' },
    { char: '🇦🇸', name: 'American Samoa Flag', shortcode: ':american_samoa:' },
    { char: '🇦🇼', name: 'Aruba Flag', shortcode: ':aruba:' },
    { char: '🇦🇽', name: 'Aland Islands Flag', shortcode: ':aland_islands:' },
    { char: '🇦🇿', name: 'Azerbaijan Flag', shortcode: ':azerbaijan:' },
    { char: '🇧🇦', name: 'Bosnia Herzegovina Flag', shortcode: ':bosnia_herzegovina:' },
    { char: '🇧🇧', name: 'Barbados Flag', shortcode: ':barbados:' },
    { char: '🇧🇩', name: 'Bangladesh Flag', shortcode: ':bangladesh:' },
    { char: '🇧🇫', name: 'Burkina Faso Flag', shortcode: ':burkina_faso:' },
    { char: '🇧🇬', name: 'Bulgaria Flag', shortcode: ':bulgaria:' },
    { char: '🇧🇭', name: 'Bahrain Flag', shortcode: ':bahrain:' },
    { char: '🇧🇮', name: 'Burundi Flag', shortcode: ':burundi:' },
    { char: '🇧🇯', name: 'Benin Flag', shortcode: ':benin:' },
    { char: '🇧🇱', name: 'St Barthelemy Flag', shortcode: ':st_barthelemy:' },
    { char: '🇧🇲', name: 'Bermuda Flag', shortcode: ':bermuda:' },
    { char: '🇧🇳', name: 'Brunei Flag', shortcode: ':brunei:' },
    { char: '🇧🇸', name: 'Bahamas Flag', shortcode: ':bahamas:' },
    { char: '🇧🇹', name: 'Bhutan Flag', shortcode: ':bhutan:' },
    { char: '🇧🇻', name: 'Bouvet Island Flag', shortcode: ':bouvet_island:' },
    { char: '🇧🇼', name: 'Botswana Flag', shortcode: ':botswana:' },
    { char: '🇧🇾', name: 'Belarus Flag', shortcode: ':belarus:' },
    { char: '🇧🇿', name: 'Belize Flag', shortcode: ':belize:' },
    { char: '🇨🇨', name: 'Cocos Islands Flag', shortcode: ':cocos_islands:' },
    { char: '🇨🇩', name: 'Congo - Kinshasa Flag', shortcode: ':congo_kinshasa:' },
    { char: '🇨🇫', name: 'Central African Republic Flag', shortcode: ':central_african_republic:' },
    { char: '🇨🇬', name: 'Congo - Brazzaville Flag', shortcode: ':congo_brazzaville:' },
    { char: '🇨🇮', name: 'Cote d Ivoire Flag', shortcode: ':cote_divoire:' },
    { char: '🇨🇰', name: 'Cook Islands Flag', shortcode: ':cook_islands:' },
    { char: '🇨🇲', name: 'Cameroon Flag', shortcode: ':cameroon:' },
    { char: '🇨🇷', name: 'Costa Rica Flag', shortcode: ':costa_rica:' },
    { char: '🇨🇺', name: 'Cuba Flag', shortcode: ':cuba:' },
    { char: '🇨🇻', name: 'Cape Verde Flag', shortcode: ':cape_verde:' },
    { char: '🇨🇼', name: 'Curacao Flag', shortcode: ':curacao:' },
    { char: '🇨🇽', name: 'Christmas Island Flag', shortcode: ':christmas_island:' },
    { char: '🇨🇾', name: 'Cyprus Flag', shortcode: ':cyprus:' },
    { char: '🇨🇿', name: 'Czechia Flag', shortcode: ':czech_republic:' },
    { char: '🇩🇬', name: 'Diego Garcia Flag', shortcode: ':diego_garcia:' },
    { char: '🇩🇯', name: 'Djibouti Flag', shortcode: ':djibouti:' },
    { char: '🇩🇲', name: 'Dominica Flag', shortcode: ':dominica:' },
    { char: '🇩🇴', name: 'Dominican Republic Flag', shortcode: ':dominican_republic:' },
    { char: '🇩🇿', name: 'Algeria Flag', shortcode: ':algeria:' },
    { char: '🇪🇦', name: 'Ceuta Melilla Flag', shortcode: ':ceuta_melilla:' },
    { char: '🇪🇨', name: 'Ecuador Flag', shortcode: ':ecuador:' },
    { char: '🇪🇪', name: 'Estonia Flag', shortcode: ':estonia:' },
    { char: '🇪🇭', name: 'Western Sahara Flag', shortcode: ':western_sahara:' },
    { char: '🇪🇷', name: 'Eritrea Flag', shortcode: ':eritrea:' },
    { char: '🇪🇹', name: 'Ethiopia Flag', shortcode: ':ethiopia:' },
    { char: '🇪🇺', name: 'European Union Flag', shortcode: ':eu:' },
    { char: '🇫🇯', name: 'Fiji Flag', shortcode: ':fiji:' },
    { char: '🇫🇰', name: 'Falkland Islands Flag', shortcode: ':falkland_islands:' },
    { char: '🇫🇲', name: 'Micronesia Flag', shortcode: ':micronesia:' },
    { char: '🇫🇴', name: 'Faroe Islands Flag', shortcode: ':faroe_islands:' },
    { char: '🇬🇦', name: 'Gabon Flag', shortcode: ':gabon:' },
    { char: '🇬🇩', name: 'Grenada Flag', shortcode: ':grenada:' },
    { char: '🇬🇪', name: 'Georgia Flag', shortcode: ':georgia:' },
    { char: '🇬🇫', name: 'French Guiana Flag', shortcode: ':french_guiana:' },
    { char: '🇬🇬', name: 'Guernsey Flag', shortcode: ':guernsey:' },
    { char: '🇬🇮', name: 'Gibraltar Flag', shortcode: ':gibraltar:' },
    { char: '🇬🇱', name: 'Greenland Flag', shortcode: ':greenland:' },
    { char: '🇬🇲', name: 'Gambia Flag', shortcode: ':gambia:' },
    { char: '🇬🇳', name: 'Guinea Flag', shortcode: ':guinea:' },
    { char: '🇬🇵', name: 'Guadeloupe Flag', shortcode: ':guadeloupe:' },
    { char: '🇬🇶', name: 'Equatorial Guinea Flag', shortcode: ':equatorial_guinea:' },
    { char: '🇬🇸', name: 'South Georgia South Sandwich Islands Flag', shortcode: ':south_georgia_south_sandwich_islands:' },
    { char: '🇬🇹', name: 'Guatemala Flag', shortcode: ':guatemala:' },
    { char: '🇬🇺', name: 'Guam Flag', shortcode: ':guam:' },
    { char: '🇬🇼', name: 'Guinea-Bissau Flag', shortcode: ':guinea_bissau:' },
    { char: '🇭🇰', name: 'Hong Kong SAR China Flag', shortcode: ':hong_kong:' },
    { char: '🇭🇲', name: 'Heard McDonald Islands Flag', shortcode: ':heard_mcdonald_islands:' },
    { char: '🇭🇳', name: 'Honduras Flag', shortcode: ':honduras:' },
    { char: '🇭🇷', name: 'Croatia Flag', shortcode: ':croatia:' },
    { char: '🇭🇹', name: 'Haiti Flag', shortcode: ':haiti:' },
    { char: '🇭🇺', name: 'Hungary Flag', shortcode: ':hungary:' },
    { char: '🇮🇨', name: 'Canary Islands Flag', shortcode: ':canary_islands:' },
    { char: '🇮🇩', name: 'Indonesia Flag', shortcode: ':indonesia:' },
    { char: '🇮🇪', name: 'Ireland Flag', shortcode: ':ireland:' },
    { char: '🇮🇱', name: 'Israel Flag', shortcode: ':israel:' },
    { char: '🇮🇲', name: 'Isle of Man Flag', shortcode: ':isle_of_man:' },
    { char: '🇮🇴', name: 'British Indian Ocean Territory Flag', shortcode: ':british_indian_ocean_territory:' },
    { char: '🇮🇶', name: 'Iraq Flag', shortcode: ':iraq:' },
    { char: '🇮🇷', name: 'Iran Flag', shortcode: ':iran:' },
    { char: '🇮🇸', name: 'Iceland Flag', shortcode: ':iceland:' },
    { char: '🇯🇪', name: 'Jersey Flag', shortcode: ':jersey:' },
    { char: '🇯🇲', name: 'Jamaica Flag', shortcode: ':jamaica:' },
    { char: '🇯🇴', name: 'Jordan Flag', shortcode: ':jordan:' },
    { char: '🇰🇬', name: 'Kyrgyzstan Flag', shortcode: ':kyrgyzstan:' },
    { char: '🇰🇭', name: 'Cambodia Flag', shortcode: ':cambodia:' },
    { char: '🇰🇮', name: 'Kiribati Flag', shortcode: ':kiribati:' },
    { char: '🇰🇲', name: 'Comoros Flag', shortcode: ':comoros:' },
    { char: '🇰🇳', name: 'St Kitts Nevis Flag', shortcode: ':st_kitts_nevis:' },
    { char: '🇰🇵', name: 'North Korea Flag', shortcode: ':north_korea:' },
    { char: '🇰🇼', name: 'Kuwait Flag', shortcode: ':kuwait:' },
    { char: '🇰🇾', name: 'Cayman Islands Flag', shortcode: ':cayman_islands:' },
    { char: '🇰🇿', name: 'Kazakhstan Flag', shortcode: ':kazakhstan:' },
    { char: '🇱🇦', name: 'Laos Flag', shortcode: ':laos:' },
    { char: '🇱🇧', name: 'Lebanon Flag', shortcode: ':lebanon:' },
    { char: '🇱🇨', name: 'St Lucia Flag', shortcode: ':st_lucia:' },
    { char: '🇱🇮', name: 'Liechtenstein Flag', shortcode: ':liechtenstein:' },
    { char: '🇱🇰', name: 'Sri Lanka Flag', shortcode: ':sri_lanka:' },
    { char: '🇱🇷', name: 'Liberia Flag', shortcode: ':liberia:' },
    { char: '🇱🇸', name: 'Lesotho Flag', shortcode: ':lesotho:' },
    { char: '🇱🇹', name: 'Lithuania Flag', shortcode: ':lithuania:' },
    { char: '🇱🇺', name: 'Luxembourg Flag', shortcode: ':luxembourg:' },
    { char: '🇱🇻', name: 'Latvia Flag', shortcode: ':latvia:' },
    { char: '🇱🇾', name: 'Libya Flag', shortcode: ':libya:' },
    { char: '🇲🇨', name: 'Monaco Flag', shortcode: ':monaco:' },
    { char: '🇲🇩', name: 'Moldova Flag', shortcode: ':moldova:' },
    { char: '🇲🇪', name: 'Montenegro Flag', shortcode: ':montenegro:' },
    { char: '🇲🇫', name: 'St Martin Flag', shortcode: ':st_martin:' },
    { char: '🇲🇬', name: 'Madagascar Flag', shortcode: ':madagascar:' },
    { char: '🇲🇭', name: 'Marshall Islands Flag', shortcode: ':marshall_islands:' },
    { char: '🇲🇰', name: 'North Macedonia Flag', shortcode: ':macedonia:' },
    { char: '🇲🇱', name: 'Mali Flag', shortcode: ':mali:' },
    { char: '🇲🇲', name: 'Myanmar (Burma) Flag', shortcode: ':myanmar:' },
    { char: '🇲🇳', name: 'Mongolia Flag', shortcode: ':mongolia:' },
    { char: '🇲🇴', name: 'Macao SAR China Flag', shortcode: ':macau:' },
    { char: '🇲🇵', name: 'Northern Mariana Islands Flag', shortcode: ':northern_mariana_islands:' },
    { char: '🇲🇶', name: 'Martinique Flag', shortcode: ':martinique:' },
    { char: '🇲🇷', name: 'Mauritania Flag', shortcode: ':mauritania:' },
    { char: '🇲🇸', name: 'Montserrat Flag', shortcode: ':montserrat:' },
    { char: '🇲🇹', name: 'Malta Flag', shortcode: ':malta:' },
    { char: '🇲🇺', name: 'Mauritius Flag', shortcode: ':mauritius:' },
    { char: '🇲🇻', name: 'Maldives Flag', shortcode: ':maldives:' },
    { char: '🇲🇼', name: 'Malawi Flag', shortcode: ':malawi:' },
    { char: '🇲🇾', name: 'Malaysia Flag', shortcode: ':malaysia:' },
    { char: '🇲🇿', name: 'Mozambique Flag', shortcode: ':mozambique:' },
    { char: '🇳🇦', name: 'Namibia Flag', shortcode: ':namibia:' },
    { char: '🇳🇨', name: 'New Caledonia Flag', shortcode: ':new_caledonia:' },
    { char: '🇳🇪', name: 'Niger Flag', shortcode: ':niger:' },
    { char: '🇳🇫', name: 'Norfolk Island Flag', shortcode: ':norfolk_island:' },
    { char: '🇳🇮', name: 'Nicaragua Flag', shortcode: ':nicaragua:' },
    { char: '🇳🇵', name: 'Nepal Flag', shortcode: ':nepal:' },
    { char: '🇳🇷', name: 'Nauru Flag', shortcode: ':nauru:' },
    { char: '🇳🇺', name: 'Niue Flag', shortcode: ':niue:' },
    { char: '🇳🇿', name: 'New Zealand Flag', shortcode: ':new_zealand:' },
    { char: '🇴🇲', name: 'Oman Flag', shortcode: ':oman:' },
    { char: '🇵🇦', name: 'Panama Flag', shortcode: ':panama:' },
    { char: '🇵🇫', name: 'French Polynesia Flag', shortcode: ':french_polynesia:' },
    { char: '🇵🇬', name: 'Papua New Guinea Flag', shortcode: ':papua_new_guinea:' },
    { char: '🇵🇭', name: 'Philippines Flag', shortcode: ':philippines:' },
    { char: '🇵🇰', name: 'Pakistan Flag', shortcode: ':pakistan:' },
    { char: '🇵🇱', name: 'Poland Flag', shortcode: ':poland:' },
    { char: '🇵🇲', name: 'St Pierre Miquelon Flag', shortcode: ':st_pierre_miquelon:' },
    { char: '🇵🇳', name: 'Pitcairn Islands Flag', shortcode: ':pitcairn_islands:' },
    { char: '🇵🇷', name: 'Puerto Rico Flag', shortcode: ':puerto_rico:' },
    { char: '🇵🇸', name: 'Palestinian Territories Flag', shortcode: ':palestinian_territories:' },
    { char: '🇵🇼', name: 'Palau Flag', shortcode: ':palau:' },
    { char: '🇶🇦', name: 'Qatar Flag', shortcode: ':qatar:' },
    { char: '🇷🇪', name: 'Réunion Flag', shortcode: ':reunion:' },
    { char: '🇷🇴', name: 'Romania Flag', shortcode: ':romania:' },
    { char: '🇷🇸', name: 'Serbia Flag', shortcode: ':serbia:' },
    { char: '🇷🇼', name: 'Rwanda Flag', shortcode: ':rwanda:' },
    { char: '🇸🇦', name: 'Saudi Arabia Flag', shortcode: ':saudi_arabia:' },
    { char: '🇸🇧', name: 'Solomon Islands Flag', shortcode: ':solomon_islands:' },
    { char: '🇸🇨', name: 'Seychelles Flag', shortcode: ':seychelles:' },
    { char: '🇸🇩', name: 'Sudan Flag', shortcode: ':sudan:' },
    { char: '🇸🇬', name: 'Singapore Flag', shortcode: ':singapore:' },
    { char: '🇸🇭', name: 'St Helena Flag', shortcode: ':st_helena:' },
    { char: '🇸🇮', name: 'Slovenia Flag', shortcode: ':slovenia:' },
    { char: '🇸🇯', name: 'Svalbard Jan Mayen Flag', shortcode: ':svalbard_jan_mayen:' },
    { char: '🇸🇰', name: 'Slovakia Flag', shortcode: ':slovakia:' },
    { char: '🇸🇱', name: 'Sierra Leone Flag', shortcode: ':sierra_leone:' },
    { char: '🇸🇲', name: 'San Marino Flag', shortcode: ':san_marino:' },
    { char: '🇸🇳', name: 'Senegal Flag', shortcode: ':senegal:' },
    { char: '🇸🇴', name: 'Somalia Flag', shortcode: ':somalia:' },
    { char: '🇸🇸', name: 'South Sudan Flag', shortcode: ':south_sudan:' },
    { char: '🇸🇹', name: 'Sao Tome Principe Flag', shortcode: ':sao_tome_principe:' },
    { char: '🇸🇻', name: 'El Salvador Flag', shortcode: ':el_salvador:' },
    { char: '🇸🇽', name: 'Sint Maarten Flag', shortcode: ':sint_maarten:' },
    { char: '🇸🇾', name: 'Syria Flag', shortcode: ':syria:' },
    { char: '🇸🇿', name: 'Eswatini Flag', shortcode: ':swaziland:' },
    { char: '🇹🇦', name: 'Tristan da Cunha Flag', shortcode: ':tristan_da_cunha:' },
    { char: '🇹🇨', name: 'Turks Caicos Islands Flag', shortcode: ':turks_caicos_islands:' },
    { char: '🇹🇩', name: 'Chad Flag', shortcode: ':chad:' },
    { char: '🇹🇫', name: 'French Southern Territories Flag', shortcode: ':french_southern_territories:' },
    { char: '🇹🇬', name: 'Togo Flag', shortcode: ':togo:' },
    { char: '🇹🇭', name: 'Thailand Flag', shortcode: ':thailand:' },
    { char: '🇹🇯', name: 'Tajikistan Flag', shortcode: ':tajikistan:' },
    { char: '🇹🇰', name: 'Tokelau Flag', shortcode: ':tokelau:' },
    { char: '🇹🇱', name: 'Timor-Leste Flag', shortcode: ':timor_leste:' },
    { char: '🇹🇲', name: 'Turkmenistan Flag', shortcode: ':turkmenistan:' },
    { char: '🇹🇳', name: 'Tunisia Flag', shortcode: ':tunisia:' },
    { char: '🇹🇴', name: 'Tonga Flag', shortcode: ':tonga:' },
    { char: '🇹🇹', name: 'Trinidad Tobago Flag', shortcode: ':trinidad_tobago:' },
    { char: '🇹🇻', name: 'Tuvalu Flag', shortcode: ':tuvalu:' },
    { char: '🇹🇼', name: 'Taiwan Flag', shortcode: ':taiwan:' },
    { char: '🇺🇦', name: 'Ukraine Flag', shortcode: ':ukraine:' },
    { char: '🇺🇬', name: 'Uganda Flag', shortcode: ':uganda:' },
    { char: '🇺🇲', name: 'U.S. Outlying Islands Flag', shortcode: ':us_outlying_islands:' },
    { char: '🇺🇳', name: 'United Nations Flag', shortcode: ':united_nations:' },
    { char: '🇻🇦', name: 'Vatican City Flag', shortcode: ':vatican_city:' },
    { char: '🇻🇨', name: 'St Vincent Grenadines Flag', shortcode: ':st_vincent_grenadines:' },
    { char: '🇻🇬', name: 'British Virgin Islands Flag', shortcode: ':british_virgin_islands:' },
    { char: '🇻🇮', name: 'U.S. Virgin Islands Flag', shortcode: ':us_virgin_islands:' },
    { char: '🇻🇳', name: 'Vietnam Flag', shortcode: ':vietnam:' },
    { char: '🇻🇺', name: 'Vanuatu Flag', shortcode: ':vanuatu:' },
    { char: '🇼🇫', name: 'Wallis Futuna Flag', shortcode: ':wallis_futuna:' },
    { char: '🇼🇸', name: 'Samoa Flag', shortcode: ':samoa:' },
    { char: '🇽🇰', name: 'Kosovo Flag', shortcode: ':kosovo:' },
    { char: '🇾🇪', name: 'Yemen Flag', shortcode: ':yemen:' },
    { char: '🇾🇹', name: 'Mayotte Flag', shortcode: ':mayotte:' },
    { char: '🇿🇲', name: 'Zambia Flag', shortcode: ':zambia:' },
  ])

  // Load recent emojis from localStorage
  onMounted(() => {
    const saved = localStorage.getItem('recent-emojis')
    if (saved) {
      try {
        recentEmojis.value = JSON.parse(saved)
      } catch {
        // Ignore parsing errors
      }
    }

    // Filter emojis based on OS support
    smileyEmojis.value = filterSupportedEmojis(smileyEmojis.value)
    animalEmojis.value = filterSupportedEmojis(animalEmojis.value)
    foodEmojis.value = filterSupportedEmojis(foodEmojis.value)
    activityEmojis.value = filterSupportedEmojis(activityEmojis.value)
    travelEmojis.value = filterSupportedEmojis(travelEmojis.value)
    objectEmojis.value = filterSupportedEmojis(objectEmojis.value)
    flagEmojis.value = filterSupportedEmojis(flagEmojis.value)
  })

  function selectEmoji(emoji: Emoji) {
    // Add to recent emojis
    const filtered = recentEmojis.value.filter(e => e.char !== emoji.char)
    recentEmojis.value = [emoji, ...filtered].slice(0, 24) // Keep only 24 recent emojis

    // Save to localStorage
    localStorage.setItem('recent-emojis', JSON.stringify(recentEmojis.value))

    // Emit the emoji
    emit('insert-emoji', emoji)
    emit('update:open', false)
  }
</script>
