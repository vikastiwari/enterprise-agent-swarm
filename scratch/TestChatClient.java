import java.lang.reflect.Method;
public class TestChatClient {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("org.springframework.ai.chat.client.ChatClient$Builder");
        for (Method m : clazz.getMethods()) {
            if (m.getName().toLowerCase().contains("tool") || m.getName().toLowerCase().contains("function")) {
                System.out.println(m);
            }
        }
    }
}
