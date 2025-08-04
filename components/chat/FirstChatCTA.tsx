export const FirstChatCTA = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground  max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Fash AI Assistant</h2>
      <p className="mb-6">Chào mừng bạn đến với trợ lý AI thông minh</p>

      <div className="grid grid-cols-2 gap-5 w-full">
        {[1, 2, 3, 4].map((e) => (
          <div key={e} className="w-full h-[100px] lg:h-[200px] bg-primary/10 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
};
