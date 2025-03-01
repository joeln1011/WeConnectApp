import { default as Post } from "@components/Post";
import { fireEvent, render, screen } from "@testing-library/react";
describe("Post component", () => {
  [];
  test("renders the post content correctly", () => {
    const { getByText } = render(
      <Post
        fullName="Joel Nguyen"
        content="Hello World"
        createdAt={Date.now()}
      />,
    );
    expect(getByText("Joel Nguyen")).toBeInTheDocument();
  });

  test("display the correct number of likes", () => {
    const likes = [1, 2, 3, 4];
    const { getByText } = render(
      <Post
        fullName="Joel Nguyen"
        content="Hello World"
        createdAt={Date.now()}
        likes={likes}
      />,
    );
    expect(getByText("4")).toBeInTheDocument();
  });

  test("Calls onlike with id when like button is clicked", () => {
    const mockOnLike = jest.fn();

    render(
      <Post
        id="joelnguyen"
        fullName="Joel Nguyen"
        content="Hello World"
        createdAt={Date.now()}
        onLike={mockOnLike}
      />,
    );
    const likeButton = screen.getByText("Like");
    fireEvent.click(likeButton);
    expect(mockOnLike).toHaveBeenCalledWith("joelnguyen");
  });

  test("renders an image when image prop is available", () => {
    render(
      <Post
        id="joelnguyen"
        fullName="Joel Nguyen"
        content="Hello World"
        createdAt={Date.now()}
        image="https://example.com/image.jpg"
      />,
    );
    const imageElm = screen.getByRole("img");
    expect(imageElm).toBeInTheDocument();
    expect(imageElm).toHaveAttribute("src", "https://example.com/image.jpg");
  });
});
