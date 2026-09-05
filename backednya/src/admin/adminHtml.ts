export const getAdminHtml = () => `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PromptStudio - Admin Panel</title>
    <!-- Vue 3 -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-100 text-gray-800 font-sans">
    <div id="app">

    <!-- LOGIN SCREEN -->
    <div v-if="!isLoggedIn" class="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900">Admin Panel</h2>
                <p class="text-gray-500 mt-2">Login ke PromptStudio</p>
            </div>
            
            <form @submit.prevent="login">
                <div v-if="loginError" class="mb-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                    {{ loginError }}
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input v-model="loginForm.email" type="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input v-model="loginForm.password" type="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                </div>
                <button type="submit" :disabled="isLoading" class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                    {{ isLoading ? 'Loading...' : 'Login' }}
                </button>
            </form>
        </div>
    </div>

    <!-- DASHBOARD -->
    <div v-else class="min-h-screen flex flex-col md:flex-row bg-gray-100">
        <!-- Sidebar -->
        <div :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'" class="fixed md:relative md:translate-x-0 z-20 w-64 h-screen bg-gray-900 text-white transition-transform duration-300 ease-in-out">
            <div class="p-6 flex justify-between items-center">
                <h1 class="text-2xl font-bold">PromptStudio</h1>
                <button @click="sidebarOpen = false" class="md:hidden text-gray-400 hover:text-white">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <nav class="mt-6 px-4 space-y-2">
                <a @click="currentView = 'audiences'" :class="currentView === 'audiences' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'" class="block px-4 py-3 rounded-lg cursor-pointer transition flex items-center gap-3">
                    <i class="fas fa-bullseye w-5 text-center"></i> Target Audiens
                </a>
                <a @click="currentView = 'styles'" :class="currentView === 'styles' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'" class="block px-4 py-3 rounded-lg cursor-pointer transition flex items-center gap-3">
                    <i class="fas fa-paint-brush w-5 text-center"></i> Gaya & Tema Desain
                </a>
                <a @click="currentView = 'templates'" :class="currentView === 'templates' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'" class="block px-4 py-3 rounded-lg cursor-pointer transition flex items-center gap-3">
                    <i class="fas fa-file-alt w-5 text-center"></i> Templates
                </a>
                <a @click="currentView = 'characters'" :class="currentView === 'characters' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'" class="block px-4 py-3 rounded-lg cursor-pointer transition flex items-center gap-3">
                    <i class="fas fa-user-friends w-5 text-center"></i> Karakter AI
                </a>
                <a @click="currentView = 'history'" :class="currentView === 'history' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'" class="block px-4 py-3 rounded-lg cursor-pointer transition flex items-center gap-3">
                    <i class="fas fa-history w-5 text-center"></i> Riwayat Prompt
                </a>
                <a @click="currentView = 'apikeys'" :class="currentView === 'apikeys' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'" class="block px-4 py-3 rounded-lg cursor-pointer transition flex items-center gap-3">
                    <i class="fas fa-key w-5 text-center"></i> Groq API Keys
                </a>
            </nav>
            <div class="absolute bottom-0 w-full p-4">
                <button @click="logout" class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>

        <!-- Mobile Overlay -->
        <div v-if="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"></div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col h-screen overflow-hidden">
            <!-- Header -->
            <header class="bg-white shadow-sm h-16 flex items-center px-4 justify-between">
                <button @click="sidebarOpen = true" class="md:hidden text-gray-600 hover:text-gray-900">
                    <i class="fas fa-bars text-xl"></i>
                </button>
                <h2 class="text-xl font-semibold capitalize">{{ currentView.replace('apikeys', 'API Keys') }}</h2>
                <div class="flex items-center gap-3">
                    <img :src="user?.avatarUrl || 'https://ui-avatars.com/api/?name=Admin'" class="w-8 h-8 rounded-full border">
                    <span class="font-medium hidden sm:block">{{ user?.name }}</span>
                </div>
            </header>

            <!-- Content Area -->
            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
                
                <!-- Toast Notification -->
                <div v-if="toast.show" :class="toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'" class="fixed top-4 right-4 z-50 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-opacity">
                    <i :class="toast.type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'"></i>
                    {{ toast.message }}
                </div>

                <!-- View: CATEGORIES -->
                <div v-if="currentView === 'categories'">
                    <div class="flex justify-between mb-6">
                        <h3 class="text-2xl font-bold">Kelola Kategori</h3>
                        <button @click="openModal('categories')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><i class="fas fa-plus mr-2"></i>Tambah Kategori</button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div v-for="cat in data.categories" :key="cat.id" class="bg-white rounded-xl shadow p-4 flex flex-col justify-between">
                            <div class="flex items-center space-x-3 mb-4">
                                <div class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl overflow-hidden" :style="{ backgroundColor: cat.color ? cat.color + '33' : '#f3f4f6' }">
                                    <img v-if="cat.icon && (cat.icon.startsWith('http') || cat.icon.includes('assets/'))" :src="getImageUrl(cat.icon)" class="w-full h-full object-cover" @error="$event.target.src='https://placehold.co/100x100?text=Error'">
                                    <span v-else>{{ cat.icon || '📁' }}</span>
                                </div>
                                <div>
                                    <h4 class="font-bold text-gray-800">{{ cat.name }}</h4>
                                    <div class="flex items-center space-x-1 mt-1">
                                        <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: cat.color || '#6366F1' }"></div>
                                        <span class="text-xs text-gray-500">{{ cat.color || '#6366F1' }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-end space-x-2 border-t pt-3">
                                <button @click="openModal('categories', cat)" class="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded"><i class="fas fa-edit mr-1"></i> Edit</button>
                                <button @click="deleteItem('categories', cat.id)" class="text-red-600 hover:bg-red-50 px-3 py-1 rounded"><i class="fas fa-trash mr-1"></i> Hapus</button>
                            </div>
                        </div>
                        <div v-if="!data.categories.length" class="col-span-full bg-white rounded-xl shadow p-8 text-center text-gray-500">
                            Belum ada kategori
                        </div>
                    </div>
                </div>

                <!-- View: AUDIENCES -->
                <div v-if="currentView === 'audiences'">
                    <div class="flex justify-between mb-6">
                        <h3 class="text-2xl font-bold">Target Audiens</h3>
                        <button @click="openModal('audiences')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><i class="fas fa-plus mr-2"></i>Tambah Audiens</button>
                    </div>
                    <div class="bg-white rounded-xl shadow overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Audiens</th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <tr v-for="aud in data.audiences" :key="aud.id">
                                    <td class="px-6 py-4 font-medium">{{ aud.name }}</td>
                                    <td class="px-6 py-4 text-right space-x-3">
                                        <button @click="openModal('audiences', aud)" class="text-blue-600 hover:text-blue-900"><i class="fas fa-edit"></i></button>
                                        <button @click="deleteItem('audiences', aud.id)" class="text-red-600 hover:text-red-900"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- View: STYLES -->
                <div v-if="currentView === 'styles'">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-gray-900">Kelola Gaya Desain</h3>
                        <button @click="openModal('styles')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition duration-150 flex items-center gap-2 shadow-sm">
                            <i class="fas fa-plus"></i> Tambah Gaya Desain
                        </button>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <div v-for="style in data.styles" :key="style.id" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition duration-200">
                            <!-- Image container -->
                            <div class="h-44 bg-gray-100 relative group overflow-hidden">
                                <img v-if="style.imageUrl" :src="getImageUrl(style.imageUrl)" class="w-full h-full object-cover group-hover:scale-105 transition duration-300 cursor-pointer" @click="openModal('styleDetail', style)" @error="$event.target.src='https://placehold.co/300x200?text=No+Image'">
                                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 cursor-pointer" @click="openModal('styleDetail', style)">
                                    <i class="fas fa-paint-brush text-3xl"></i>
                                </div>
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"></div>
                                <span class="absolute bottom-3 left-4 text-white font-bold text-base drop-shadow-sm">{{ style.name }}</span>
                            </div>
                            
                            <!-- Card Body -->
                            <div class="p-4 flex-1 flex flex-col justify-between">
                                <p class="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">
                                    {{ style.description || 'Tidak ada deskripsi singkat.' }}
                                </p>
                                
                                <div class="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                                    <!-- View Detail Button -->
                                    <button @click="openModal('styleDetail', style)" class="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1">
                                        <i class="fas fa-eye"></i> Detail
                                    </button>
                                    
                                    <!-- Action buttons -->
                                    <div class="flex gap-1">
                                        <button @click="openModal('styles', style)" class="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition" title="Edit">
                                            <i class="fas fa-edit text-xs"></i>
                                        </button>
                                        <button @click="deleteItem('styles', style.id)" class="text-gray-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition" title="Hapus">
                                            <i class="fas fa-trash text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="!data.styles.length" class="col-span-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                            Belum ada gaya desain
                        </div>
                    </div>
                </div>

                <!-- View: API KEYS -->
                <div v-if="currentView === 'apikeys'">
                    <div class="flex justify-between mb-6">
                        <h3 class="text-2xl font-bold">Groq API Keys</h3>
                        <button @click="openModal('apikeys')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><i class="fas fa-plus mr-2"></i>Tambah API Key</button>
                    </div>
                    <div class="bg-white rounded-xl shadow overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">API Key</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Error Count</th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <tr v-for="key in data.apikeys" :key="key.id">
                                    <td class="px-6 py-4 font-mono text-sm">
                                        {{ key.api_key.substring(0, 8) }}...{{ key.api_key.substring(key.api_key.length - 4) }}
                                    </td>
                                    <td class="px-6 py-4 text-center">
                                        <span :class="key.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 rounded-full text-xs font-medium">
                                            {{ key.is_active ? 'Aktif' : 'Nonaktif' }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-center">
                                        <span :class="key.error_count > 0 ? 'text-orange-600 font-bold' : 'text-gray-500'">{{ key.error_count }}</span>
                                    </td>
                                    <td class="px-6 py-4 text-right space-x-3">
                                        <button v-if="key.error_count > 0 || !key.is_active" @click="resetApiKey(key.id)" title="Reset Error Count" class="text-green-600 hover:text-green-900"><i class="fas fa-sync-alt"></i></button>
                                        <button @click="deleteItem('apikeys', key.id)" class="text-red-600 hover:text-red-900"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- View: TEMPLATES -->
                <div v-if="currentView === 'templates'">
                    <div class="flex justify-between mb-6">
                        <h3 class="text-2xl font-bold">Templates & Preset</h3>
                        <button @click="openModal('templates')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><i class="fas fa-plus mr-2"></i>Tambah Template</button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div v-for="temp in data.templates" :key="temp.id" class="bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-200">
                            <div class="h-40 bg-gray-200 relative">
                                <img v-if="getFirstImage(temp.thumbnailUrl)" :src="getImageUrl(getFirstImage(temp.thumbnailUrl))" class="w-full h-full object-cover cursor-pointer" @click="previewZoomImage(getFirstImage(temp.thumbnailUrl))" @error="$event.target.src='https://placehold.co/100x100?text=Error'">
                                <div v-else class="w-full h-full flex items-center justify-center text-gray-400"><i class="fas fa-file-image text-4xl"></i></div>
                                <span v-if="getImageCount(temp.thumbnailUrl) > 1" class="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium"><i class="fas fa-images mr-1"></i>{{ getImageCount(temp.thumbnailUrl) }}</span>
                            </div>
                            <div class="p-4 flex-1 flex flex-col">
                                <h4 class="font-bold text-gray-900 mb-1">{{ temp.title }}</h4>
                                <p class="text-xs text-blue-600 font-medium mb-2">{{ temp.category?.name || 'Uncategorized' }}</p>
                                <p class="text-sm text-gray-600 flex-1 line-clamp-3">{{ temp.description }}</p>
                                <div class="mt-4 pt-4 border-t flex justify-end items-center">
                                    <div class="gap-2 flex">
                                        <button @click="openModal('templates', temp)" class="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"><i class="fas fa-edit"></i></button>
                                        <button @click="deleteItem('templates', temp.id)" class="text-red-600 hover:bg-red-50 px-2 py-1 rounded"><i class="fas fa-trash"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                <!-- View: CHARACTERS -->
                <div v-if="currentView === 'characters'">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-gray-900">Kelola Karakter AI</h3>
                        <button @click="openModal('characters')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition duration-150 flex items-center gap-2 shadow-sm">
                            <i class="fas fa-plus"></i> Tambah Karakter
                        </button>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <div v-for="char in data.characters" :key="char.id" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition duration-200">
                            <!-- Image container -->
                            <div class="h-44 bg-gray-100 relative group overflow-hidden">
                                <img v-if="char.imageUrl" :src="getImageUrl(char.imageUrl)" class="w-full h-full object-contain bg-gray-50 group-hover:scale-105 transition duration-300 cursor-pointer" @click="openModal('styleDetail', char)" @error="$event.target.src='https://placehold.co/300x200?text=No+Image'">
                                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 cursor-pointer" @click="openModal('styleDetail', char)">
                                    <i class="fas fa-user-circle text-3xl"></i>
                                </div>
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"></div>
                                <span class="absolute bottom-3 left-4 text-white font-bold text-base drop-shadow-sm">{{ char.name }}</span>
                            </div>
                            
                            <!-- Card Body -->
                            <div class="p-4 flex-1 flex flex-col justify-between">
                                <p class="text-xs text-gray-500 line-clamp-3 mb-4 flex-1">
                                    {{ char.prompt }}
                                </p>
                                
                                <div class="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                                    <!-- View Detail Button -->
                                    <button @click="openModal('styleDetail', char)" class="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1">
                                        <i class="fas fa-eye"></i> Detail
                                    </button>
                                    
                                    <!-- Action buttons -->
                                    <div class="flex gap-1">
                                        <button @click="openModal('characters', char)" class="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition" title="Edit">
                                            <i class="fas fa-edit text-xs"></i>
                                        </button>
                                        <button @click="deleteItem('characters', char.id)" class="text-gray-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition" title="Hapus">
                                            <i class="fas fa-trash text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="!data.characters.length" class="col-span-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                            Belum ada karakter
                        </div>
                    </div>
                </div>

                <!-- View: HISTORY -->
                <div v-if="currentView === 'history'">
                    <div class="flex justify-between mb-6">
                        <h3 class="text-2xl font-bold">Riwayat Pembuatan (History)</h3>
                    </div>
                    <div class="bg-white rounded-xl shadow overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gambar</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul / Prompt</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <tr v-for="hist in data.history" :key="hist.id" class="hover:bg-gray-50">
                                    <td class="px-4 py-3">
                                        <img v-if="hist.imageUrl" :src="getImageUrl(hist.imageUrl)" class="w-12 h-12 rounded object-cover border" @error="$event.target.src='https://placehold.co/100x100?text=Error'">
                                        <div v-else class="w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs"><i class="fas fa-image"></i></div>
                                    </td>
                                    <td class="px-4 py-3">
                                        <p class="font-semibold text-gray-900">{{ hist.title }}</p>
                                        <p class="text-xs text-gray-500">{{ hist.designStyle }} • {{ hist.slideCount }} slide</p>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-gray-600">{{ hist.userName || hist.userEmail || 'Unknown User' }}</td>
                                    <td class="px-4 py-3 text-sm text-gray-500">{{ new Date(hist.createdAt).toLocaleDateString('id-ID') }}</td>
                                    <td class="px-4 py-3 text-right space-x-2">
                                        <button @click="openModal('historyDetail', hist)" class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg" title="Lihat Detail Prompt"><i class="fas fa-eye"></i></button>
                                        <button @click="convertToTemplate(hist)" class="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-lg" title="Alihkan jadi Template"><i class="fas fa-copy"></i></button>
                                        <button @click="openModal('history', hist)" class="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg" title="Edit/Upload Gambar"><i class="fas fa-edit"></i></button>
                                        <button @click="deleteItem('history', hist.id)" class="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg" title="Hapus Riwayat"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    </div>

    <!-- MODAL OVERLAY -->
    <div v-if="modal.show" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div class="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                <h3 class="text-lg font-bold text-gray-900">
                    <span v-if="modal.type === 'styleDetail'">Detail Gaya Desain</span>
                    <span v-else-if="modal.type === 'historyDetail'">Detail Riwayat Prompt</span>
                    <span v-else>{{ modal.isEdit ? 'Edit' : 'Tambah' }} {{ modal.type.toUpperCase() }}</span>
                </h3>
                <button @click="modal.show = false" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
            </div>
            
            <div class="p-6 overflow-y-auto">
                <form @submit.prevent="submitModal">
                    
                    <!-- Kategori / Audiens -->
                    <div v-if="modal.type === 'categories' || modal.type === 'audiences'" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                            <input v-model="modal.form.name" type="text" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div v-if="modal.type === 'categories'" class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Icon URL (CDN/External)</label>
                                <input v-model="modal.form.iconCdnUrl" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Contoh: https://...">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Atau Upload Icon</label>
                                <input type="file" @change="e => uploadImage(e, 'icon')" accept="image/*" class="w-full px-3 py-1.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm">
                            </div>
                        </div>
                        <div v-if="modal.type === 'categories' && (modal.form.icon || modal.form.iconCdnUrl)" class="mt-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Pratinjau Icon</label>
                            <div class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl overflow-hidden border">
                                <img v-if="(modal.form.iconCdnUrl || modal.form.icon) && ((modal.form.iconCdnUrl || modal.form.icon).startsWith('http') || (modal.form.iconCdnUrl || modal.form.icon).includes('assets/'))" :src="getImageUrl(modal.form.iconCdnUrl || modal.form.icon)" class="w-full h-full object-cover">
                                <span v-else>{{ modal.form.iconCdnUrl || modal.form.icon }}</span>
                            </div>
                        </div>
                        <div v-if="modal.type === 'categories'">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Warna Aksen (Hex)</label>
                            <input v-model="modal.form.color" type="color" class="w-full h-10 border rounded-lg cursor-pointer">
                        </div>
                    </div>

                    <!-- API Keys -->
                    <div v-if="modal.type === 'apikeys'" class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Groq API Key</label>
                        <input v-model="modal.form.apiKey" type="text" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 font-mono text-sm">
                    </div>

                    <!-- Gaya Desain -->
                    <div v-if="modal.type === 'styles'" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Desain</label>
                            <input v-model="modal.form.name" type="text" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                            <textarea v-model="modal.form.description" rows="2" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Detail / Instruksi AI (Prompt)</label>
                            <textarea v-model="modal.form.prompt" rows="3" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">URL Gambar (CDN)</label>
                                <input v-model="modal.form.cdnUrl" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="https://...">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Atau Upload Gambar</label>
                                <input type="file" @change="e => uploadImage(e, 'imageUrl')" accept="image/*" class="w-full px-3 py-1.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm">
                            </div>
                        </div>
                        <div v-if="modal.form.imageUrl || modal.form.cdnUrl" class="mt-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Pratinjau Gambar</label>
                            <img :src="getImageUrl(modal.form.cdnUrl || modal.form.imageUrl)" class="h-24 rounded-lg border object-cover">
                        </div>
                    </div>

                    <!-- Templates -->
                    <div v-if="modal.type === 'templates'" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Judul Template</label>
                            <input v-model="modal.form.title" type="text" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select v-model="modal.form.categoryId" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                                    <option :value="null">Pilih Kategori</option>
                                    <option v-for="c in data.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                            <input v-model="modal.form.description" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Isi Content (Prompt Template)</label>
                            <textarea v-model="modal.form.content" rows="4" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Contoh: Buatlah postingan Instagram tentang [topik]..."></textarea>
                        </div>
                        <div class="pt-4 border-t">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Gambar Template (bisa lebih dari 1)</label>
                            
                            <!-- Preview uploaded images -->
                            <div v-if="modal.form.imageList && modal.form.imageList.length > 0" class="grid grid-cols-4 gap-3 mb-3">
                                <div v-for="(img, idx) in modal.form.imageList" :key="idx" class="relative group">
                                    <img :src="getImageUrl(img)" class="w-full h-24 object-cover rounded-lg border border-gray-200 cursor-pointer" @click="previewZoomImage(img)" @error="$event.target.src='https://placehold.co/100x100?text=Error'">
                                    <button type="button" @click="removeTemplateImage(idx)" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow"><i class="fas fa-times"></i></button>
                                    <span class="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">{{ idx + 1 }}</span>
                                </div>
                            </div>
                            
                            <input type="file" @change="uploadMultipleImages" accept="image/*" multiple class="w-full px-3 py-1.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm">
                            <p class="text-xs text-gray-500 mt-1">Upload beberapa gambar sekaligus (setiap slide/prompt bisa punya gambar sendiri)</p>
                        </div>
                    </div>

                    <!-- Themes Form -->
                    <div v-if="modal.type === 'themes'" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Tema</label>
                            <input v-model="modal.form.name" type="text" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Peruntukan</label>
                            <select v-model="modal.form.category" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                                <option value="LOGO">LOGO (Penjelasan Logo Modern)</option>
                                <option value="IKLAN">IKLAN (Carousel Promosi/Iklan)</option>
                                <option value="UMUM">UMUM / LAINNYA</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                            <textarea v-model="modal.form.description" rows="2" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Detail / Instruksi Latar Belakang (Prompt)</label>
                            <textarea v-model="modal.form.prompt" rows="3" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Contoh: Premium minimalist brand deck, off-white background..."></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">URL Gambar Pratinjau (CDN)</label>
                                <input v-model="modal.form.cdnUrl" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="https://...">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Atau Upload Gambar</label>
                                <input type="file" @change="e => uploadImage(e, 'imageUrl')" accept="image/*" class="w-full px-3 py-1.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm">
                            </div>
                        </div>
                        <div v-if="modal.form.imageUrl || modal.form.cdnUrl" class="mt-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Pratinjau Gambar</label>
                            <img :src="getImageUrl(modal.form.cdnUrl || modal.form.imageUrl)" class="h-24 rounded-lg border object-cover">
                        </div>
                    </div>

                    <!-- Characters Form -->
                    <div v-if="modal.type === 'characters'" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Karakter</label>
                            <input v-model="modal.form.name" type="text" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Prompt Karakter (Detail, Pakaian, Ciri Fisik, dll)</label>
                            <textarea v-model="modal.form.prompt" rows="4" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Contoh: A 25-year-old Asian man, short black hair, wearing a white t-shirt and blue jeans, simple minimalist cartoon style..."></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">URL Gambar Pratinjau (CDN)</label>
                                <input v-model="modal.form.cdnUrl" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="https://...">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Atau Upload Gambar</label>
                                <input type="file" @change="e => uploadImage(e, 'imageUrl')" accept="image/*" class="w-full px-3 py-1.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm">
                            </div>
                        </div>
                        <div v-if="modal.form.imageUrl || modal.form.cdnUrl" class="mt-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Pratinjau Gambar</label>
                            <img :src="getImageUrl(modal.form.cdnUrl || modal.form.imageUrl)" class="h-32 rounded-lg border object-contain bg-gray-50">
                        </div>
                    </div>

                    <!-- History -->
                    <div v-if="modal.type === 'history'" class="space-y-4">
                        <div class="bg-blue-50 p-4 rounded-lg mb-4 text-sm text-blue-800 border border-blue-200">
                            <strong>Info:</strong> Anda dapat mengedit Judul atau menambahkan gambar hasil *render* akhir agar pengguna dapat melihat contoh nyata dari *prompt* ini.
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Judul Riwayat Topik</label>
                            <input v-model="modal.form.title" type="text" required class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div class="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Image URL (CDN/Hasil)</label>
                                <input v-model="modal.form.cdnUrl" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="https://...">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Atau Upload Gambar Hasil</label>
                                <input type="file" @change="e => uploadImage(e, 'imageUrl')" accept="image/*" class="w-full px-3 py-1.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm">
                            </div>
                        </div>
                        <div v-if="modal.form.imageUrl || modal.form.cdnUrl" class="mt-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Pratinjau Gambar Hasil</label>
                            <img :src="getImageUrl(modal.form.cdnUrl || modal.form.imageUrl)" class="h-24 rounded-lg border object-cover">
                        </div>
                    </div>

                    <!-- Style Detail (View Only) -->
                    <div v-if="modal.type === 'styleDetail'" class="space-y-4">
                        <div class="flex flex-col md:flex-row gap-6">
                            <div class="w-full md:w-1/3">
                                <div class="relative group rounded-xl overflow-hidden shadow border border-gray-200 bg-gray-50">
                                    <img v-if="modal.form.imageUrl" :src="getImageUrl(modal.form.imageUrl)" class="w-full h-64 object-contain cursor-zoom-in hover:scale-105 transition duration-300" @click="previewZoomImage(modal.form.imageUrl)" @error="$event.target.src='https://placehold.co/200x200?text=Error'">
                                    <div v-else class="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-3xl"><i class="fas fa-paint-brush"></i></div>
                                </div>
                            </div>
                            <div class="flex-1 space-y-4">
                                <div>
                                    <h4 class="text-xl font-bold text-gray-900">{{ modal.form.name }}</h4>
                                </div>
                                <div v-if="modal.form.description" class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Deskripsi Singkat</p>
                                    <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ modal.form.description }}</p>
                                </div>
                                <div class="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                    <div class="flex justify-between items-center mb-2">
                                        <p class="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Prompt Visual (AI Instructions)</p>
                                        <button type="button" @click="copyText(modal.form.prompt)" class="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium bg-white px-2 py-1 rounded shadow-sm hover:shadow transition border border-indigo-100">
                                            <i class="fas fa-copy"></i> Salin Prompt
                                        </button>
                                    </div>
                                    <p class="text-sm font-mono text-gray-800 bg-white p-3 rounded border border-indigo-50 whitespace-pre-wrap overflow-y-auto max-h-60 leading-relaxed">{{ modal.form.prompt || 'Tidak ada instruksi prompt.' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- History Detail (View Only) -->
                    <div v-if="modal.type === 'historyDetail'" class="space-y-4">
                        <div class="bg-gray-50 p-4 rounded-lg border">
                            <h4 class="font-bold text-gray-900 mb-2">Judul: {{ modal.form.title }}</h4>
                            <div class="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{{ modal.form.content }}</div>
                            <div v-if="modal.form.imageUrl" class="mt-4">
                                <p class="font-bold text-gray-900 mb-2">Gambar Hasil:</p>
                                <img :src="getImageUrl(modal.form.imageUrl)" class="max-h-64 rounded-lg border" @error="$event.target.src='https://placehold.co/100x100?text=Error'">
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end gap-3 pt-4 border-t">
                        <button type="button" @click="modal.show = false" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                            {{ (modal.type === 'historyDetail' || modal.type === 'styleDetail') ? 'Tutup' : 'Batal' }}
                        </button>
                        <button v-if="modal.type !== 'historyDetail' && modal.type !== 'styleDetail'" type="submit" :disabled="isLoading" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                            {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    </div>

    <script>
        const { createApp } = Vue;

        createApp({
            data() {
                return {
                    isLoggedIn: false,
                    token: '',
                    user: null,
                    sidebarOpen: false,
                    currentView: 'styles',
                    isLoading: false,
                    loginError: '',
                    loginForm: { email: '', password: '' },
                    toast: { show: false, message: '', type: 'success' },
                    data: {
                        categories: [],
                        audiences: [],
                        styles: [],
                        themes: [],
                        apikeys: [],
                        templates: [],
                        characters: [],
                        history: []
                    },
                    modal: {
                        show: false,
                        type: '',
                        isEdit: false,
                        id: null,
                        form: {}
                    },

                }
            },
            mounted() {
                const savedToken = localStorage.getItem('admin_token');
                if (savedToken) {
                    this.token = savedToken;
                    this.isLoggedIn = true;
                    this.loadAllData();
                }
            },
            watch: {
                currentView() {
                    this.sidebarOpen = false;
                    this.loadDataForView(this.currentView);
                }
            },
            methods: {
                getImageUrl(url) {
                    if (!url) return '';
                    if (url.startsWith('http') || url.startsWith('data:')) return url;
                    // Handle relative paths like /assets/... by prepending server origin
                    const base = window.location.origin;
                    return url.startsWith('/') ? (base + url) : (base + '/' + url);
                },
                copyText(text) {
                    if (!text) return;
                    navigator.clipboard.writeText(text)
                        .then(() => this.showToast('Prompt disalin ke clipboard!'))
                        .catch(() => this.showToast('Gagal menyalin prompt', 'error'));
                },
                showToast(msg, type = 'success') {
                    this.toast = { show: true, message: msg, type };
                    setTimeout(() => this.toast.show = false, 3000);
                },
                getHeaders() {
                    return {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.token
                    };
                },
                async fetchApi(url, options = {}) {
                    options.headers = this.getHeaders();
                    const res = await fetch(url, options);
                    
                    if (res.status === 401 || res.status === 403) {
                        this.logout();
                        throw new Error('Sesi telah berakhir, silakan login kembali.');
                    }
                    
                    const json = await res.json();
                    if (!res.ok) throw new Error(json.message || 'Gagal memproses request');
                    return json;
                },
                async login() {
                    this.isLoading = true;
                    this.loginError = '';
                    try {
                        const res = await fetch('/api/auth/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(this.loginForm)
                        });
                        const data = await res.json();
                        if (res.ok) {
                            this.token = data.accessToken;
                            this.user = data.user;
                            localStorage.setItem('admin_token', this.token);
                            this.isLoggedIn = true;
                            this.loadAllData();
                        } else {
                            this.loginError = data.message || 'Login gagal';
                        }
                    } catch (e) {
                        this.loginError = 'Terjadi kesalahan jaringan.';
                    } finally {
                        this.isLoading = false;
                    }
                },
                logout() {
                    this.isLoggedIn = false;
                    this.token = '';
                    this.user = null;
                    localStorage.removeItem('admin_token');
                    window.location.reload();
                },
                async loadAllData() {
                    await this.loadDataForView(this.currentView);
                },
                async loadDataForView(view) {
                    try {
                        if (view === 'categories') {
                            const res = await this.fetchApi('/api/categories');
                            this.data.categories = res;
                        } else if (view === 'audiences') {
                            const res = await this.fetchApi('/api/options/audiences');
                            this.data.audiences = res;
                        } else if (view === 'styles') {
                            const res = await this.fetchApi('/api/options/styles');
                            this.data.styles = res;
                        } else if (view === 'apikeys') {
                            const res = await this.fetchApi('/api/options/groq-keys');
                            this.data.apikeys = res;
                        } else if (view === 'templates') {
                            const res = await this.fetchApi('/api/templates?limit=100');
                            this.data.templates = res.templates || res.data || [];
                        } else if (view === 'history') {
                            const res = await this.fetchApi('/api/prompt/history/all');
                            this.data.history = res;
                        } else if (view === 'themes') {
                            const res = await this.fetchApi('/api/options/themes');
                            this.data.themes = res;
                        } else if (view === 'characters') {
                            const res = await this.fetchApi('/api/options/characters');
                            this.data.characters = res;
                        }
                    } catch(e) {
                        this.showToast(e.message, 'error');
                    }
                },
                openModal(type, item = null) {
                    this.modal.type = type;
                    this.modal.isEdit = !!item;
                    this.modal.id = item ? item.id : null;
                    
                    if (type === 'categories') {
                        const icon = item ? item.icon : '';
                        const isCdn = icon && (icon.startsWith('http://') || icon.startsWith('https://'));
                        this.modal.form = { 
                            name: item ? item.name : '', 
                            icon: icon,
                            iconCdnUrl: isCdn ? icon : '',
                            color: item && item.color ? item.color : '#6366F1' 
                        };
                    } else if (type === 'audiences') {
                        this.modal.form = { name: item ? item.name : '' };
                    } else if (type === 'apikeys') {
                        this.modal.form = { apiKey: '' }; 
                    } else if (type === 'styles') {
                        const imageUrl = item ? item.imageUrl : '';
                        const isCdn = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));
                        this.modal.form = { 
                            name: item ? item.name : '', 
                            description: item ? item.description : '',
                            prompt: item ? item.prompt : '',
                            imageUrl: imageUrl,
                            cdnUrl: isCdn ? imageUrl : ''
                        };
                    } else if (type === 'themes') {
                        const imageUrl = item ? item.imageUrl : '';
                        const isCdn = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));
                        this.modal.form = { 
                            name: item ? item.name : '', 
                            category: item ? item.category : 'LOGO', 
                            description: item ? item.description : '',
                            prompt: item ? item.prompt : '',
                            imageUrl: imageUrl,
                            cdnUrl: isCdn ? imageUrl : ''
                        };
                    } else if (type === 'characters') {
                        const imageUrl = item ? item.imageUrl : '';
                        const isCdn = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));
                        this.modal.form = { 
                            name: item ? item.name : '', 
                            prompt: item ? item.prompt : '',
                            imageUrl: imageUrl,
                            cdnUrl: isCdn ? imageUrl : ''
                        };
                    } else if (type === 'styleDetail') {
                        this.modal.form = { 
                            name: item ? item.name : '', 
                            description: item ? item.description : '',
                            prompt: item ? item.prompt : '',
                            imageUrl: item ? item.imageUrl : ''
                        };
                    } else if (type === 'templates') {
                        let imageList = [];
                        if (item && item.thumbnailUrl) {
                            try {
                                const parsed = JSON.parse(item.thumbnailUrl);
                                if (Array.isArray(parsed)) imageList = parsed;
                                else imageList = [item.thumbnailUrl];
                            } catch(e) {
                                imageList = item.thumbnailUrl ? [item.thumbnailUrl] : [];
                            }
                        }
                        this.modal.form = {
                            title: item ? item.title : '',
                            description: item ? item.description : '',
                            content: item ? item.content : '',
                            categoryId: item ? item.categoryId : null,
                            imageList: imageList,
                            isPremium: false
                        };
                    } else if (type === 'history') {
                        const imageUrl = item ? item.imageUrl : '';
                        const isCdn = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));
                        this.modal.form = {
                            title: item ? item.title : '',
                            imageUrl: imageUrl,
                            cdnUrl: isCdn ? imageUrl : ''
                        };
                    } else if (type === 'historyDetail') {
                        this.modal.form = {
                            title: item ? item.title : '',
                            content: item ? item.generatedPrompt : '',
                            imageUrl: item ? item.imageUrl : ''
                        };
                    }
                    this.modal.show = true;
                },
                convertToTemplate(hist) {
                    this.currentView = 'templates';
                    this.modal.type = 'templates';
                    this.modal.isEdit = false;
                    this.modal.id = null;
                    this.modal.form = {
                        title: hist.title || '',
                        description: 'Dibuat dari riwayat: ' + (hist.designStyle || ''),
                        content: hist.generatedPrompt || '',
                        categoryId: null,
                        imageList: hist.imageUrl ? [hist.imageUrl] : [],
                        isPremium: false
                    };
                    this.modal.show = true;
                },

                getFirstImage(thumbnailUrl) {
                    if (!thumbnailUrl) return null;
                    try {
                        const parsed = JSON.parse(thumbnailUrl);
                        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
                    } catch(e) {}
                    return thumbnailUrl;
                },

                getImageCount(thumbnailUrl) {
                    if (!thumbnailUrl) return 0;
                    try {
                        const parsed = JSON.parse(thumbnailUrl);
                        if (Array.isArray(parsed)) return parsed.length;
                    } catch(e) {}
                    return thumbnailUrl ? 1 : 0;
                },

                async uploadImage(event, fieldTarget) {
                    const file = event.target.files[0];
                    if (!file) return;
                    
                    this.isLoading = true;
                    try {
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        const response = await fetch('/api/upload', {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer ' + this.token
                            },
                            body: formData
                        });
                        
                        if (response.status === 401 || response.status === 403) {
                            this.logout();
                            throw new Error('Sesi telah berakhir, silakan login kembali.');
                        }

                        const data = await response.json();
                        if (!response.ok) throw new Error(data.message || 'Gagal mengupload gambar');
                        
                        // Using dynamic fieldTarget to assign to correct property (imageUrl or thumbnailUrl)
                        this.modal.form[fieldTarget] = data.url;
                        if (fieldTarget === 'imageUrl') {
                            this.modal.form.cdnUrl = '';
                        } else if (fieldTarget === 'icon') {
                            this.modal.form.iconCdnUrl = '';
                        }
                        this.showToast('Gambar berhasil diupload');
                    } catch (e) {
                        this.showToast(e.message, 'error');
                    } finally {
                        this.isLoading = false;
                        // Reset file input value so same file can be chosen again if needed
                        event.target.value = '';
                    }
                },

                async uploadMultipleImages(event) {
                    const files = event.target.files;
                    if (!files || files.length === 0) return;
                    
                    this.isLoading = true;
                    try {
                        if (!this.modal.form.imageList) this.modal.form.imageList = [];
                        
                        for (let i = 0; i < files.length; i++) {
                            const formData = new FormData();
                            formData.append('file', files[i]);
                            
                            const response = await fetch('/api/upload', {
                                method: 'POST',
                                headers: { 'Authorization': 'Bearer ' + this.token },
                                body: formData
                            });
                            
                            if (response.status === 401 || response.status === 403) {
                                this.logout();
                                throw new Error('Sesi telah berakhir, silakan login kembali.');
                            }
                            
                            const data = await response.json();
                            if (!response.ok) throw new Error(data.message || 'Gagal mengupload gambar');
                            
                            this.modal.form.imageList.push(data.url);
                        }
                        this.showToast(files.length + ' gambar berhasil diupload');
                    } catch (e) {
                        this.showToast(e.message, 'error');
                    } finally {
                        this.isLoading = false;
                        event.target.value = '';
                    }
                },

                removeTemplateImage(idx) {
                    this.modal.form.imageList.splice(idx, 1);
                },

                previewZoomImage(imgUrl) {
                    const overlay = document.createElement('div');
                    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
                    const img = document.createElement('img');
                    img.src = this.getImageUrl(imgUrl);
                    img.style.cssText = 'max-width:90%;max-height:90%;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);';
                    overlay.appendChild(img);
                    overlay.addEventListener('click', () => overlay.remove());
                    document.body.appendChild(overlay);
                },

                async submitModal() {
                    this.isLoading = true;
                    try {
                        let url = '';
                        let method = this.modal.isEdit ? 'PUT' : 'POST';
                        let body = { ...this.modal.form };

                        if (body.cdnUrl !== undefined) {
                            if (body.cdnUrl) {
                                body.imageUrl = body.cdnUrl;
                            }
                            delete body.cdnUrl;
                        }
                        if (body.iconCdnUrl !== undefined) {
                            if (body.iconCdnUrl) {
                                body.icon = body.iconCdnUrl;
                            }
                            delete body.iconCdnUrl;
                        }

                        if (this.modal.type === 'categories') {
                            url = '/api/categories';
                            if (this.modal.isEdit) url += '/' + this.modal.id;
                        } else if (this.modal.type === 'audiences') {
                            url = '/api/options/audiences';
                            if (this.modal.isEdit) url += '/' + this.modal.id;
                        } else if (this.modal.type === 'styles') {
                            url = '/api/options/styles';
                            if (this.modal.isEdit) url += '/' + this.modal.id;
                        } else if (this.modal.type === 'themes') {
                            url = '/api/options/themes';
                            if (this.modal.isEdit) url += '/' + this.modal.id;
                        } else if (this.modal.type === 'characters') {
                            url = '/api/options/characters';
                            if (this.modal.isEdit) url += '/' + this.modal.id;
                        } else if (this.modal.type === 'apikeys') {
                            url = '/api/options/groq-keys';
                            body = { apiKey: this.modal.form.apiKey };
                        } else if (this.modal.type === 'templates') {
                            if (!this.modal.form.categoryId) {
                                this.showToast('Kategori harus dipilih untuk Template!', 'error');
                                this.isLoading = false;
                                return;
                            }
                            // Serialize imageList array as JSON for thumbnailUrl
                            body.thumbnailUrl = (this.modal.form.imageList && this.modal.form.imageList.length > 0)
                                ? JSON.stringify(this.modal.form.imageList)
                                : null;
                            delete body.imageList;
                            url = '/api/templates';
                            if (this.modal.isEdit) url += '/' + this.modal.id;
                        } else if (this.modal.type === 'history') {
                            url = '/api/prompt/history/' + this.modal.id;
                            // History only supports edit (PUT) from admin panel
                            method = 'PUT';
                        }

                        await this.fetchApi(url, {
                            method,
                            body: JSON.stringify(body)
                        });

                        this.showToast('Berhasil disimpan!');
                        this.modal.show = false;
                        this.loadDataForView(this.modal.type);
                    } catch (e) {
                        this.showToast(e.message, 'error');
                    } finally {
                        this.isLoading = false;
                    }
                },
                async deleteItem(type, id) {
                    if (!confirm('Anda yakin ingin menghapus data ini?')) return;
                    try {
                        let url = '';
                        if (type === 'categories') url = '/api/categories/' + id;
                        else if (type === 'audiences') url = '/api/options/audiences/' + id;
                        else if (type === 'styles') url = '/api/options/styles/' + id;
                        else if (type === 'themes') url = '/api/options/themes/' + id;
                        else if (type === 'characters') url = '/api/options/characters/' + id;
                        else if (type === 'apikeys') url = '/api/options/groq-keys/' + id;
                        else if (type === 'templates') url = '/api/templates/' + id;
                        else if (type === 'history') url = '/api/prompt/history/' + id;

                        await this.fetchApi(url, { method: 'DELETE' });
                        this.showToast('Berhasil dihapus!');
                        this.loadDataForView(type);
                    } catch (e) {
                        this.showToast(e.message, 'error');
                    }
                }
            }
        }).mount('#app');
    </script>
</body>
</html>
`;
