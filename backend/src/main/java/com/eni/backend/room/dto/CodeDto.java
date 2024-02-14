package com.eni.backend.room.dto;


import com.eni.backend.member.entity.Member;
import com.eni.backend.problem.entity.Code;
import com.eni.backend.problem.entity.CodeStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class CodeDto {

    private Member member;
    private String content;
    private CodeStatus codeStatus;
    private Long time;
    private Long memory;

    @Builder
    private CodeDto(Member member, String content, CodeStatus codeStatus, Long time, Long memory) {
        this.member = member;
        this.content = content;
        this.codeStatus = codeStatus;
        this.time = time;
        this.memory = memory;
    }

    public static CodeDto from(Code code) {
        return builder()
                .member(code.getMember())
                .content(code.getContent())
                .codeStatus(code.getStatus())
                .time(code.getTime())
                .memory(code.getMemory())
                .build();
    }

    public static CodeDto from(Member member) {
        return builder()
                .member(member)
                .content(null)
                .codeStatus(CodeStatus.FAIL)
                .time(Long.MAX_VALUE)
                .memory(Long.MAX_VALUE)
                .build();
    }

}
