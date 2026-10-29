<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

import { connectSocket, getSocket } from "@/socket/socket";

import { useAuthStore } from "@/stores/auth";

import type { PrivateMessage, SendPrivateMessage } from "@/types/chat";

const authStore = useAuthStore();

const recipientId = ref("");
const message = ref("");

const messages = ref<PrivateMessage[]>([]);

const isConnected = ref(false);

const messagesContainer = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
  await nextTick();

  if (!messagesContainer.value) {
    return;
  }

  messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
};

const handlePrivateMessage = (data: PrivateMessage) => {
  messages.value.push(data);

  scrollToBottom();
};

const handleMessageSent = (data: PrivateMessage) => {
  messages.value.push(data);

  scrollToBottom();
};

const sendMessage = () => {
  const socket = getSocket();

  const trimmedRecipientId = recipientId.value.trim();

  const trimmedMessage = message.value.trim();

  if (!socket || !socket.connected || !trimmedRecipientId || !trimmedMessage) {
    return;
  }

  const data: SendPrivateMessage = {
    recipientId: trimmedRecipientId,
    message: trimmedMessage,
  };

  socket.emit("private_message", data);

  message.value = "";
};

onMounted(() => {
  const socket = connectSocket();

  if (!socket) {
    return;
  }

  socket.on("connect", () => {
    isConnected.value = true;

    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    isConnected.value = false;

    console.log("Socket disconnected");
  });

  socket.on("private_message", handlePrivateMessage);

  socket.on("private_message_sent", handleMessageSent);

  if (socket.connected) {
    isConnected.value = true;
  }
});

onBeforeUnmount(() => {
  const socket = getSocket();

  if (!socket) {
    return;
  }

  socket.off("private_message", handlePrivateMessage);

  socket.off("private_message_sent", handleMessageSent);

  socket.off("connect");
  socket.off("disconnect");
});
</script>

<template>
  <div class="mx-auto max-w-4xl">
    <div class="overflow-hidden rounded-xl bg-white shadow">
      <!-- Header -->

      <div class="flex items-center justify-between border-b p-5">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Private Chat</h1>

          <p class="mt-1 text-sm text-gray-500">
            Logged in as:
            {{ authStore.user?.userName }}
          </p>

          <p class="text-xs text-gray-400">
            ID:
            {{ authStore.user?.userId }}
          </p>
        </div>

        <div class="flex items-center gap-2 text-sm">
          <span
            class="h-2.5 w-2.5 rounded-full"
            :class="isConnected ? 'bg-green-500' : 'bg-red-500'"
          />

          <span>
            {{ isConnected ? "Connected" : "Disconnected" }}
          </span>
        </div>
      </div>

      <!-- Recipient -->

      <div class="border-b p-5">
        <label class="mb-2 block text-sm font-medium text-gray-700">
          Recipient User ID
        </label>

        <input
          v-model="recipientId"
          type="text"
          placeholder="Enter recipient userId"
          class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <!-- Messages -->

      <div
        ref="messagesContainer"
        class="h-[450px] overflow-y-auto bg-gray-50 p-5"
      >
        <div
          v-if="messages.length === 0"
          class="flex h-full items-center justify-center text-gray-400"
        >
          No messages yet
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(item, index) in messages"
            :key="index"
            class="flex"
            :class="
              item.senderId === authStore.user?.userId
                ? 'justify-end'
                : 'justify-start'
            "
          >
            <div
              class="max-w-[70%] rounded-xl px-4 py-3"
              :class="
                item.senderId === authStore.user?.userId
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 shadow'
              "
            >
              <p>
                {{ item.message }}
              </p>

              <p class="mt-1 text-xs opacity-70">
                {{ new Date(item.timestamp).toLocaleTimeString() }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Message input -->

      <form class="flex gap-3 border-t p-5" @submit.prevent="sendMessage">
        <input
          v-model="message"
          type="text"
          placeholder="Type a message..."
          class="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        <button
          type="submit"
          :disabled="!isConnected || !recipientId.trim() || !message.trim()"
          class="cursor-pointer rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>
